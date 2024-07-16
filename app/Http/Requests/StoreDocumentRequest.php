<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Constants\SignerType;
use Illuminate\Validation\Rule;

class StoreDocumentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'document' => 'required|file',
            'company_name' => 'required|string',
            'sender_name' => 'required|string',
            'sender_email' => 'required|email',
            'signers' => 'required|array|min:1',
            'signers.*.signatures' => 'required|array|min:1',
            'signers.*.name' => 'required|string',
            'signers.*.email' => 'required|email',
            'signers.*.type' => [
                'required',
                'string',
                Rule::in([SignerType::CUSTOMER, SignerType::STAFF, SignerType::HELPER]),
            ],
            'signers.*.signatures.*.coordinate_x' => 'required|numeric',
            'signers.*.signatures.*.coordinate_y' => 'required|numeric',
            'signers.*.signatures.*.height' => 'numeric|min:10',
            'signers.*.signatures.*.width' => 'numeric',
            'signers.*.signatures.*.page_no' => 'required|numeric',
        ];
    }

    public function messages()
    {
        return [
            'document.required' => 'The document is required.',
            'document.file' => 'The document must be a file.',
            'company_name.required' => 'The company name is required.',
            'company_name.string' => 'The company name must be a string.',
            'sender_name.required' => 'The sender name is required.',
            'sender_name.string' => 'The sender name must be a string.',
            'sender_email.required' => 'The sender email is required.',
            'sender_email.email' => 'The sender email must be a valid email address.',
            'signers.required' => 'There must be at least one signer.',
            'signers.array' => 'Signers must be an array.',
            'signers.min' => 'There must be at least one signer.',
            'signers.*.signatures.required' => 'Each signer must have at least one sign information.',
            'signers.*.signatures.array' => 'Sign information must be an array.',
            'signers.*.signatures.min' => 'Each signer must have at least one sign information.',
            'signers.*.name.required' => 'Each signer must have a name.',
            'signers.*.name.string' => 'Each signer\'s name must be a string.',
            'signers.*.email.required' => 'Each signer must have an email.',
            'signers.*.email.email' => 'Each signer\'s email must be a valid email address.',
            'signers.*.type.string' => 'Each signer\'s type must be a string.',
            'signers.*.type.in' => 'Each signer\'s type must be one of the following: customer, staff, helper.',
            'signers.*.signatures.*.coordinate_x.required' => 'Each sign information must have an x-coordinate.',
            'signers.*.signatures.*.coordinate_x.numeric' => 'Each sign information\'s x-coordinate must be a number.',
            'signers.*.signatures.*.coordinate_y.required' => 'Each sign information must have a y-coordinate.',
            'signers.*.signatures.*.coordinate_y.numeric' => 'Each sign information\'s y-coordinate must be a number.',
            'signers.*.signatures.*.height.numeric' => 'Each sign information\'s height must be a number.',
            'signers.*.signatures.*.height.min' => 'Each sign information\'s height must be at least 10.',
            'signers.*.signatures.*.width.numeric' => 'Each sign information\'s width must be a number.',
            'signers.*.signatures.*.page_no.required' => 'Each sign information must have a page number.',
            'signers.*.signatures.*.page_no.numeric' => 'Each sign information\'s page number must be a number.',
        ];
    }
}
