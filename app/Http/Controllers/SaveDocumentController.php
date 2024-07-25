<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDocumentRequest;
use App\Jobs\NotifySigner;
use App\Models\Document;
use App\Models\Signature;
use App\Models\Signer;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Constants\SignerType;

class SaveDocumentController extends Controller
{
    private function checkSender($signers)
    {
        $hasSender = false;
        $senderCount = 0;
        $sender = [];

        foreach ($signers as $signer) {

            if (isset($signer['type']) && $signer['type'] === SignerType::SENDER) {
                $senderCount++;
                $hasSender = true;
                $sender['name'] = $signer['name'];
                $sender['email'] = $signer['email'];
            }
        }

        return compact('hasSender', 'senderCount', 'sender');
    }

    public function store(StoreDocumentRequest $request)
    {
        $fileName = $this->generateDocName($request);
        $documentPath = $request->file('document')->storeAs('public/documents/original', $fileName);

        $document = $this->saveDocumentDB($documentPath, $request);

        //save signers
        $signerURL = $this->saveSignerDB($document, $request);

//        dispatch(new NotifySigner($document->signers, env("API_URL")));

        return response()->json(['message' => 'Document stored successfully', 'signers' => $signerURL['signers'], 'sender' => $signerURL['sender']]);
    }

    private function generateDocName($request)
    {
        $originalFilename = $request->file('document')->getClientOriginalName();
        $extension = $request->file('document')->getClientOriginalExtension();

        $originalFilenameWithoutExtension =  pathinfo($originalFilename, PATHINFO_FILENAME);
        $originalFilenameWithoutExtension =  str_replace(' ', '_',  $originalFilenameWithoutExtension);
        $originalFilenameWithoutExtension =  str_replace('-', '_',  $originalFilenameWithoutExtension);
        $originalFilenameWithoutSpecialChar = preg_replace('/[^A-Za-z0-9\-]/', '_', $originalFilenameWithoutExtension);

        $concatenatedNames = '';

        foreach ($request->input('signers') as $signerData) {
            $name = $signerData['name'];
            $concatenatedNames .= str_replace(' ', '_', $name) . '_';
        }

        $concatenatedNames = rtrim($concatenatedNames, '_');

        $currentTimestamp = time();

        return "{$originalFilenameWithoutSpecialChar}_{$concatenatedNames}_{$currentTimestamp}.{$extension}";
    }

    private function saveDocumentDB($documentPath, $request)
    {
        $document = new Document();
        $document->sender_name = $request->input('sender_name');
        $document->sender_email = $request->input('sender_email');
        $document->company_name = $request->input('company_name');
        $ipAddress = $request->header('CF-Connecting-IP') ?? $request->getClientIp();
        $document->sender_ip = $ipAddress ?? '0.0.0.0';
        $document->original_filename = basename($documentPath);
        $document->original_path = dirname($documentPath);
        $document->short_url = Str::random(12);
        $document->total_signer = count($request->input('signers')) ?? 0;
        $document->save();
        return $document;
    }

    private function saveSignerDB($document, $data)
    {
        $signerURL = [];
        $senderURL = [];

        //save sender as signer
        $sender = $this->storeSigners($document->id, $data->input('sender_name'), $data->input('sender_email'), SignerType::SENDER);
        $senderURL[$data->input('sender_email')] = env("API_URL") . $sender['shortURL'];

        $signers = $data->input('signers');
        $order = ['customer', 'helper', 'staff'];

        usort($signers, function($a, $b) use ($order) {
            $posA = array_search($a['type'], $order);
            $posB = array_search($b['type'], $order);
            return $posA - $posB;
        });

        foreach ($signers as $signerData) {

            $signer = $this->storeSigners($document->id, $signerData['name'], $signerData['email'], $signerData['type'] ?? null);

            $signerURL[$signerData['email']] = env("API_URL") . $signer['shortURL'];

            foreach ($signerData['signatures'] as $signatureData) {
                $signature = new Signature();
                $signature->page_no = $signatureData['page_no'];
                $signature->coordinate_x = $signatureData['coordinate_x'];
                $signature->coordinate_y = $signatureData['coordinate_y'];
                $signature->height = $signatureData['height'] ?? null;
                $signature->width = $signatureData['width'] ?? null;
                $signature->signer_id = $signer['signer']->id;
                $signature->save();
            }
        }

        return [
            'signers' => $signerURL,
            'sender' => $senderURL
        ];
    }

    private function storeSigners($documentId, $name, $email, $type)
    {
        $shortURL = Str::random(12);
        $signer = new Signer();
        $signer->name = $name;
        $signer->email = $email;
        $signer->short_url = $shortURL;
        $signer->document_id = $documentId;
        $signer->type = $type;
        $signer->save();

        return compact('signer', 'shortURL');
    }


}
