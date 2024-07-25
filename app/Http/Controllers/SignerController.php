<?php

namespace App\Http\Controllers;

use App\Constants\SignerType;
use App\Http\Requests\ValidateSigner;
use App\Jobs\NotifySigner;
use App\Models\Document;
use App\Models\Signer;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class SignerController extends Controller
{

    public function fetchSigner($shortUrl)
    {
        // Validate the request parameters
        $validator = $this->validateRequest($shortUrl);

        if ($validator->fails()) {
            // If validation fails, return a response with validation errors
            return response()->json(['message' => $validator->errors()], 400);
        }

        // Retrieve the signer data
        $signerData = $this->getSignerData($shortUrl);

        if (!$signerData) {
            return response()->json(['message' => 'Invalid signer url.'], 404);
        }

        return response()->json(['name' => $signerData->name, 'email' => $signerData->email, 'type' => $signerData->type], 200);
    }

    public function notifyCustomer($shortUrl)
    {
        $document = Document::with(['signers' => function($query) {
            $query->where('type', '=', SignerType::CUSTOMER);
        }])->where('short_url', $shortUrl)->first();

        if (!empty($document->signers)) {
            foreach ($document->signers as $signer) {
                if($signer->mail_sent === 1){
                    return response()->json(['message' => 'Email has already sent'], 422);
                }
            }
        }

        dispatch(new NotifySigner($document->signers));

        return response()->json(['message' => 'Email sent successfully']);
    }

    public function requestOTP(ValidateSigner $request, $shortUrl)
    {
        // Validate the request parameters
        $validator = $this->validateRequest($shortUrl);

        if ($validator->fails()) {
            // If validation fails, return a response with validation errors
            return response()->json(['message' => $validator->errors()], 400);
        }

        // Retrieve the signer data
        $signerData = $this->getSignerData($shortUrl, $request->name, $request->email);

        if (!$signerData) {
            // If the signer record doesn't exist, return a response indicating not found
            return response()->json(['message' => 'Invalid signer.'], 404);
        }

        // Generate and save OTP
        $otpCode = $this->generateOTP();
        $this->saveOTP($signerData, $otpCode);

        if($signerData->type !== 'sender') {
            // Dispatch OTP job
            $this->dispatchOTPJob($otpCode, $request->email);
        }

        $auth = ( $signerData->type === 'customer' || $signerData->type === 'sender') ? $otpCode : null;

        return response()->json(['message' => 'OTP sent! Please check your email', 'auth' => $auth, 'type' => $signerData->type], 200);
    }

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

    protected function getSignerData($shortUrl, $name = null, $email = null)
    {
        $query = Signer::with('document')->where('short_url', $shortUrl);

        if ($name !== null) {
            $query->where('name', $name);
        }

        if ($email !== null) {
            $query->where('email', $email);
        }

        return $query->first();
    }
    public function getSignerById($id)
    {
        $signer = Signer::findOrFail($id);
        $signer->otp = $this->generateOTP();
        $signer->last_sent_otp = Carbon::now();
        $signer->save();
        $signer->makeVisible('otp');
        $signer->fresh();

        return response()->json([
            'message' => 'Data fetched successfully',
            'data' => $signer
        ]);    }

    protected function generateOTP()
    {
        return mt_rand(100000, 999999);
    }

    protected function saveOTP($signerData, $otpCode)
    {
        $signerData->otp = $otpCode;
        $signerData->last_sent_otp = Carbon::now();
        $signerData->save();
    }

    protected function dispatchOTPJob($otpCode, $email)
    {
        dispatch(new \App\Jobs\RequestOTP($otpCode, $email));
    }

    public function history(ValidateSigner $request, $shortUrl)
    {
        // Validate the request parameters
        $validator = $this->validateRequest($shortUrl);

        if ($validator->fails()) {
            // If validation fails, return a response with validation errors
            return response()->json(['message' => $validator->errors()], 400);
        }

        // Retrieve the signer data
        $signerData = $this->getSignerData($shortUrl, $request->name, $request->email);

        if (!$signerData) {
            // If the signer record doesn't exist, return a response indicating not found
            return response()->json(['message' => 'Invalid signer.'], 404);
        }

        $signatureData = $this->fetchHistory($shortUrl, $request);

        return response()->json(['data' => $signatureData], 200);
    }

    private function fetchHistory($shortUrl, $request)
    {
        return Signer::select('signature')
            ->selectRaw('MAX(created_at) as latest_created_at')
            ->where('name', $request->name)
            ->where('email', $request->email)
            ->where('type', $request->type)
            ->whereNotNull('signature')
            ->whereNotIn('short_url', [$shortUrl])
            ->groupBy('signature')
            ->orderByDesc('latest_created_at')
            ->take(6)
            ->get();
    }
}
