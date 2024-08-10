<?php

namespace App\Http\Controllers;

use App\Constants\SignerType;
use App\Http\Requests\RequestOTP;
use App\Http\Requests\StoreSignature;
use App\Jobs\NotifySender;
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

class SignatureController extends Controller
{

    protected function validateRequest($shortUrl)
    {
        return Validator::make(['short_url' => $shortUrl], [
            'short_url' => [
                'required',
                'string',
                \Illuminate\Validation\Rule::exists('signers')->where(function ($query) use ($shortUrl) {
                    $query->where('short_url', $shortUrl);
                }),
            ],
        ]);
    }

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

    public function fetchMarkedDocument(StoreSignature $request, $shortUrl)
    {
        // Validate the request parameters
        $validator = $this->validateRequest($shortUrl);

        if ($validator->fails()) {
            // If validation fails, return a response with validation errors
            return response()->json(['message' => $validator->errors()], 400);
        }

        // Retrieve the signer data
        $documentObj = $this->getSignerData($shortUrl, $request);

        if (!$documentObj) {
            // If the signer record doesn't exist, return a response indicating not found
            return response()->json(['message' => 'Invalid signer.'], 404);
        }

        $signerDoc = $this->markDocument($documentObj, $request);
        $documentData = Document::with(['signers' => function($query) {
            $query->whereNotIn('type', [SignerType::SENDER]);
        }])->find($documentObj->document->id);

        //save document viewed time
        $documentObj->viewed_time = Carbon::now();
        $documentObj->save();

        // Signer record found, return the response with associated data
        return response()->json(['message' => 'success', 'signed' => $signerDoc['signed'], 'document' => $signerDoc['document'], 'data' => $documentData], 200);
    }

    public function signature(Request $request, $shortUrl)
    {
        try {
            // Validate the request parameters
            $validator = $this->validateRequest($shortUrl);

            if ($validator->fails()) {
                // If validation fails, return a response with validation errors
                return response()->json(['message' => $validator->errors()], 400);
            }

            // Retrieve the signer data
            $documentObj = $this->getSignerData($shortUrl, $request);

            if (!$documentObj) {
                // If the signer record doesn't exist, return a response indicating not found
                return response()->json(['message' => 'Invalid signer.'], 404);
            }

            //store the signature
            if (!empty($documentObj->signatures)) {
                foreach ($documentObj->signatures as $signature) {
                    $signature->signature = $documentObj->signature;
                    $signature->save();
                }
            }

            $ipLocation = '';
            if ($position = Location::get($request->getClientIp())) {
                $ipLocation .= $position->countryName;
            }

            $documentObj->signed_time = Carbon::now();
            $ipAddress = $request->header('CF-Connecting-IP') ?? $request->getClientIp();
            $documentObj->ip_address = $ipAddress ?? '0.0.0.0';
            $documentObj->location = $ipLocation;
            $documentObj->save();

            $signedDoc = $this->setSignature($documentObj);

            $document = Document::with(['signers' => function($query) {
                $query->where('type', '!=', SignerType::SENDER);
            }])->find($documentObj->document->id);

            $document->last_signed_time = Carbon::now();
            $document->total_signed = $document->total_signed + 1;

            if ($document->total_signed + 1 >= $document->total_signer) {
                $document->status = 'Completed';
                $document->completed_signed = 1;
            }

            $document->signed = 1;
            $document->save();

//            dispatch(new NotifySender($request->name, $request->email, $document));

            return response()->json([
                'message' => 'Record stored successfully',
                'signed' => 1,
                'signedDoc' => $signedDoc,
                'data' => $document
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

    private function setSignature($documentObj)
    {
        try {
            // Create a new FPDI instance
            $pdf = new FPDI('P', 'mm');

            // Set the source file
            if ($documentObj->document->signed === 0) {
                $signedSource = storage_path("app/" . $documentObj->document->original_path . '/' . $documentObj->document->original_filename);
            } else {
                $signedSource = storage_path("app/" . $documentObj->document->signed_path . '/' . $documentObj->document->signed_filename);
            }

            $pageCount = $pdf->setSourceFile($signedSource);

            $pageCount = $documentObj->document->signed === 1 ? $pageCount - 1 : $pageCount;

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
                if (!empty($documentObj->signatures)) {
                    foreach ($documentObj->signatures as $signature) {
                        if ($pageNo == $signature->page_no) {
                            $signatureActualPath = storage_path("app/" . $documentObj->signature);

                            $imageHeightWidth = $this->calculateHeightWidth($signatureActualPath, $signature->height ?? null, $signature->width ?? null);

                            $pdf->Image($signatureActualPath, $signature->coordinate_x + 5, $signature->coordinate_y, $imageHeightWidth['width'], $imageHeightWidth['height']);
                            $this->drawFrame($pdf, $signature->coordinate_x, $signature->coordinate_y, $imageHeightWidth['height'], $imageHeightWidth['width'], $documentObj->ip_address, $documentObj->document->company_name);
                        }
                    }
                }
            }

            $documentObj->signed = 1;
            $documentObj->save();

            $cert = $this->signedCertificate($documentObj);

            // set the source file
            $pdf->setSourceFile(storage_path('app/public/documents/certificate/' . $cert));

            // import page 1
            $tplIdx = $pdf->importPage(1);

            // get the size of the imported page
            $size = $pdf->getTemplateSize($templateId);

            // create a page (landscape or portrait depending on the imported page size)
            if ($size['width'] > $size['height']) {
                $pdf->AddPage('L', array($size['width'], $size['height']));
            } else {
                $pdf->AddPage('P', array($size['width'], $size['height']));
            }

            // use the imported page as the template
            $pdf->useTemplate($tplIdx);

            $outputPath = storage_path("app/public/documents/signed/" . $documentObj->document->original_filename);

            $pdf->Output($outputPath, 'F');

            //remove certificate
            $certPath = '/public/documents/certificate/' . $cert;
            if (Storage::exists($certPath)) {
                // Delete the file
                Storage::delete($certPath);
            }

            //update signed status
            $document = Document::find($documentObj->document->id);
            $document->signed_filename = $documentObj->document->original_filename;
            $document->signed_path = 'public/documents/signed';
            $document->save();

            $markedDoc = '/public/documents/marked_coordinate/' . $documentObj->mark_coordinate_filename;

            //remove signer marked document
            if (Storage::exists($markedDoc)) {
                Storage::delete($markedDoc);
            }

            $reviewDoc = '/public/documents/review/' . $documentObj->signature_review_filename;
            if (Storage::exists($reviewDoc)) {
                Storage::delete($reviewDoc);
            }

            $documentObj->mark_coordinate_filename = "";
            $documentObj->mark_coordinate_path = "";
            $documentObj->signature_review_path = "";
            $documentObj->signature_review_filename = "";
            $documentObj->save();

            return asset('storage/documents/signed/' . $documentObj->document->original_filename . '?v=' . time());
        } catch (Exception $e) {
            throw new Exception('PDF generation failed: ' . $e->getMessage());
        }
    }

    private function markDocument($signer, $request)
    {
        if ($signer->signed === 1) {
            return ['signed' => 1, 'document' => asset('storage/documents/signed/' . $signer->document->signed_filename )];
        } else if ($signer->type === SignerType::SENDER) {

            if($signer->document->signed === 1){
                return ['signed' => 1, 'document' => asset('storage/documents/signed/' . $signer->document->signed_filename)];
            }else{
                return ['signed' => 1, 'document' => asset('storage/documents/original/' . $signer->document->original_filename)];
            }

        }

        if (!empty($signer->mark_coordinate_filename)) {
            return ['signed' => 0, 'document' => asset('storage/documents/marked_coordinate/' . $signer->mark_coordinate_filename)];
        }

        try {
            // Create a new FPDI instance
            $pdf = new FPDI('P', 'mm');

            // Set the source file
            if ($signer->document->signed == 1) {
                $documentPath = storage_path('app/' . $signer->document->signed_path . '/' . $signer->document->signed_filename);
                $pageCount = $pdf->setSourceFile($documentPath) - 1;
            } else {
                $documentPath = storage_path('app/' . $signer->document->original_path . '/' . $signer->document->original_filename);
                $pageCount = $pdf->setSourceFile($documentPath);
            }

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

                if (!empty($signer->signatures)) {
                    foreach ($signer->signatures as $signature) {
                        if ($pageNo == $signature->page_no) {
                            $height = $signature->height ?? 15;
                            $width = ($signature->height / 100) * 150;
                            $margin = 5;
                            $x = $signature->coordinate_x;
                            $y = $signature->coordinate_y;
                            $text = 'Signature Here';

                            // Draw a rectangle with border only
                            $pdf->SetDrawColor(0, 0, 0); // Set border color (black)
                            $pdf->Rect($x, $y, $width, $height); // Draw rectangle with border only

                            // Set font for the text
                            $pdf->SetFont('Arial', '', 12);

                            // Calculate position for the text
                            $textWidth = $pdf->GetStringWidth($text);
                            $textX = $x + ($width - $textWidth) / 2;
                            $textY = $y + $height + $margin; // Adjusting for font height and margin

                            // Add the text
//                        $pdf->Text($textX, $textY, $text);

                            $pdf->SetDrawColor(0, 0, 0);

                            $calculatedY = $y + (($height / 2) - 7);

                            // Draw the border rectangle
//                            $pdf->Rect($x - 18, $calculatedY, 15, 15);
                            $pdf->Image(storage_path("app/public/arrow.gif"), $x - 18, $calculatedY, 15, 15);
                        }
                    }
                }
            }

            $markedFilename = $request->email . '_' . uniqid() . '.pdf';
            $outputPath = storage_path("app/public/documents/marked_coordinate/" . $markedFilename);

            $pdf->Output($outputPath, 'F');

            $signer->mark_coordinate_path = storage_path("app/public/marked_coordinate");
            $signer->mark_coordinate_filename = $markedFilename;
            $signer->save();

            return ['signed' => 0, 'document' => asset('storage/documents/marked_coordinate/' . $markedFilename)];
        } catch (Exception $e) {
            throw new Exception('PDF generation failed: ' . $e->getMessage());
        }
    }

    private function signedCertificate($documentObj)
    {
        $signatureData = Document::with('signers', 'signers.signatures')
            ->where('short_url', $documentObj->document->short_url)
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

    public function signedCertificateWeb($id)
    {
        $signatureData = Document::with('signers', 'signers.signatures')
            ->where('short_url', $id)
            ->first();

        // Check if the signer record exists
        if (!$signatureData) {
            // If the record doesn't exist, return a response indicating not found
            return response()->json(['error' => 'Invalid signer.'], 404);
        }

        return view('certificate', ['data' => $signatureData]);
    }

    public function signedCertificatePDF($id)
    {
        $signatureData = Document::with('signers', 'signers.signatures')
            ->where('short_url', $id)
            ->first();

        // Check if the signer record exists
        if (!$signatureData) {
            // If the record doesn't exist, return a response indicating not found
            return response()->json(['error' => 'Invalid signer.'], 404);
        }

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
        $outputPath = storage_path('app/public/test/' . $filename);
        $pdf->save($outputPath);
        return $filename;
    }


    public function calculateHeightWidth(string $signatureActualPath, $height, $width)
    {
        $height = $height ?? 15;
//        $width = $width ?? 30;

        if(is_null($width))
        {

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
}
