<?php

namespace App\Http\Controllers;

use App\Constants\SignerType;
use App\Http\Requests\RequestOTP;
use App\Http\Requests\StoreSignature;
use App\Models\Document;
use App\Models\Signer;
use Carbon\Carbon;
use Exception;
use FPDF;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\Facades\Image;
use setasign\Fpdi\Fpdi;
use Stevebauman\Location\Facades\Location;
use Symfony\Component\HttpFoundation\Response;
use Barryvdh\DomPDF\Facade\Pdf;

class SignatureReviewController extends Controller
{

    protected function getSignerData($shortUrl, $request)
    {
        return Signer::with('document', 'signatures')
            ->where('short_url', $shortUrl)
            ->where('name', $request->name)
            ->where('email', $request->email)
            ->where(function ($query) use ($request) {
                $query->where('otp', $request->otp)
                    ->orWhere('type', SignerType::SENDER)
                    ->orWhere('type', SignerType::CUSTOMER);
            })
            ->first();
    }

    public function signatureReview(Request $request, $shortUrl)
    {
        try {

            // Retrieve the signer data
            $signer = $this->getSignerData($shortUrl, $request);

            if (!$signer) {
                // If the signer record doesn't exist, return a response indicating not found
                return response()->json(['message' => 'Invalid signer.'], 404);
            }

            $reviewDoc = '/public/documents/review/' . $signer->signature_review_filename;
            if (Storage::exists($reviewDoc)) {
                Storage::delete($reviewDoc);
            }

            $signaturePath = $this->setSignature($request);
            $this->replaceSignature($signaturePath, $signer);
            $this->signerMetaData($signer, $request);
            $reviewSignedDoc = $this->setSignatureReview($signer, $signaturePath);
            $this->saveReviewLocation($signer, $reviewSignedDoc);

            $reviewSignedDoc = asset('storage/documents/review/' . basename($reviewSignedDoc));

            return response()->json([
                'message' => 'Review created successfully',
                'url' => $reviewSignedDoc,
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    private function storeBase64Signature($signature)
    {
        $signatureImage = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $signature));
        $signaturePath = 'public/signatures/' . uniqid() . '.png';
        Storage::put($signaturePath, $signatureImage);
        return $signaturePath;
    }

    private function setSignatureReview($signer, $signaturePath)
    {
        try {
            // Create a new FPDI instance
            $pdf = new FPDI('P', 'mm');

            // Set the source file
            $signedSource = storage_path("app/" . $signer->document->original_path . '/' . $signer->document->original_filename);

            if ($signer->document->signed !== 0) {
                $signedSource = storage_path("app/" . $signer->document->signed_path . '/' . $signer->document->signed_filename);
            }

            $pageCount = $pdf->setSourceFile($signedSource);

            $pageCount = $signer->document->signed === 1 ? $pageCount - 1 : $pageCount;

            for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
                // import a page
                $templateId = $pdf->importPage($pageNo);
                // get the size of the imported page
                $size = $pdf->getTemplateSize($templateId);

                // create a page (landscape or portrait depending on the imported page size)
                if ($size['width'] > $size['height']) {
                    $pdf->AddPage('L', array($size['width'], $size['height']));
                } else {
                    $pdf->AddPage('P', array($size['width'], $size['height']));
                }

                // use the imported page
                $pdf->useTemplate($templateId);

                //set signature
                if (!empty($signer->signatures)) {
                    foreach ($signer->signatures as $signature) {
                        if ($pageNo == $signature->page_no) {
                            $signatureActualPath = storage_path("app/" . $signaturePath);

                            $imageHeightWidth = $this->calculateHeightWidth($signatureActualPath, $signature->height ?? null, $signature->width ?? null);

                            $pdf->Image($signatureActualPath, $signature->coordinate_x + 5, $signature->coordinate_y, $imageHeightWidth['width'], $imageHeightWidth['height']);
                            $this->drawFrame($pdf, $signature->coordinate_x, $signature->coordinate_y, $imageHeightWidth['height'], $imageHeightWidth['width'], $signer->ip_address, $signer->document->company_name);
                        }
                    }
                }
            }

            $reviewFile = $signer->email . '_' . uniqid() . '.pdf';
            $outputPath = storage_path("app/public/documents/review/" . $reviewFile);

            $pdf->Output($outputPath, 'F');

            return $outputPath;
        } catch (Exception $e) {
            throw new Exception('PDF generation failed: ' . $e->getMessage());
        }
    }

    private function signedCertificate($signer)
    {
        $signatureData = Document::with('signers', 'signers.signatures')
            ->where('short_url', $signer->document->short_url)
            ->first();

        $pdf = Pdf::setOption([
            'dpi' => 140,
            'isPhpEnabled' => true,
            'isRemoteEnabled' => true,
            'isHtml5ParserEnabled' => true,
            'isFontSubsettingEnabled' => true,
            'defaultFont' => 'Open Sans'
        ])->loadView('certificate', ['data' => $signatureData]);

        $filename = 'cert_' . uniqid() . '.pdf';

        // Save the PDF to local storage
        $outputPath = storage_path('app/public/documents/certificate/' . $filename);
        $pdf->save($outputPath);

        // Return the filename instead of downloading directly
        return $filename;
    }

    private function drawFrame($pdf, $x, $y, $height, $width, $bottomText, $topText)
    {

        $radius = 0.5; // Radius for rounded corners

        // Set border color and width
        $pdf->SetDrawColor(0, 0, 255); // Set border color to blue
        $borderWidth = 0.3;
        $pdf->SetLineWidth($borderWidth); // Set border width

        $widthSize = $width / 5;

        $pdf->Line($x + $radius, $y, $x + $widthSize - $radius, $y);
        $pdf->Line($x + $widthSize - $radius, $y + $height, $x + $radius, $y + $height); // Bottom side
        $pdf->Line($x + $radius, $y + $height, $x, $y + $height - $radius); // Bottom left curve

        $pdf->Line($x, $y + $height - $radius, $x, $y + $radius); // Left side
        $pdf->Line($x, $y + $radius, $x + $radius, $y); // Top left curve

        // Set font for the text
        $pdf->SetFont('Arial', '', 8);

        // Calculate position for the text
        $bottomTextWidth = $pdf->GetStringWidth($bottomText);
        $topTextWidth = $pdf->GetStringWidth($topText);
        $textX = $x + $widthSize;
        $topTextX = $x + ($width - $topTextWidth) / 2;
        $textY = $y + $height;

        // Add the text
        $pdf->Text($textX + 1, $textY + 1.2, $bottomText);
        $pdf->Text($textX + 1, $y + 1.2, $topText);
    }

    public function calculateHeightWidth(string $signatureActualPath, $height, $width)
    {
        $height = $height ?? 15;
        //        $width = $width ?? 30;

        if (is_null($width)) {

            if (!file_exists($signatureActualPath)) {
                echo "Error: Image file not found at $signatureActualPath";
                exit();
            }

            // Load the image
            $image = Image::make($signatureActualPath);

            // Get the image's original width and height in pixels
            $originalWidthInPixels = $image->width();
            $originalHeightInPixels = $image->height();

            // Calculate the image's original aspect ratio
            $ratio = $originalWidthInPixels / $originalHeightInPixels;

            // Calculate the new width based on the provided height and the original aspect ratio
            $width = $height * $ratio;
        }

        return compact('height', 'width');
    }

    private function replaceSignature($signaturePath, $signer)
    {
        if ($signer->signature && Storage::exists($signer->signature)) {
            // Delete the existing file
            Storage::delete($signer->signature);
        }

        $signer->signature = $signaturePath;
        $signer->save();
    }

    private function setSignature(Request $request)
    {
        $signatureType = $request->input('signatureType');

        switch ($signatureType) {
            case 'draw':
                $signature = $request->input('signatureDraw');
                break;
            case 'upload':
                $signature = $request->input('signatureFile');
                break;
            case 'type':
                $signature = $request->input('signatureText');
                break;
            default:
                $signature = $request->input('signatureHistory');
        }

        if ($signatureType !== 'history') {
            $signaturePath = $this->storeBase64Signature($signature);
        } else {
            $signaturePath = $signature;
        }

        return $signaturePath;
    }

    private function signerMetaData($signer, Request $request)
    {
        $ipLocation = '';
        if ($position = Location::get($request->getClientIp())) {
            $ipLocation .= $position->countryName;
        }

        $ipAddress = $request->header('CF-Connecting-IP') ?? $request->getClientIp();
        $signer->ip_address = $ipAddress ?? '0.0.0.0';
        $signer->location = $ipLocation;
    }

    private function saveReviewLocation($signer, $reviewSignedDoc)
    {
        $signer->signature_review_path = storage_path("app/public/review");
        $signer->signature_review_filename = basename($reviewSignedDoc);
        $signer->save();
    }
}
