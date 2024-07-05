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

    public function messages(): array
    {
        return [
            'signers.*.type.in' => 'Sender is not allowed as signer type'
        ];
    }
}
