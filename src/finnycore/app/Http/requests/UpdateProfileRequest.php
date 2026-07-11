<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

/**
 * phone_number and email are deliberately excluded here. Changing either
 * requires a separate verification flow that is out of MVP scope — the
 * same restriction the AdEMNEA Farmer API places on profile edits
 * (REQ-F-FAPI-11): identity fields require admin/verification
 * intervention, not a self-service edit.
 */
class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'address' => ['sometimes', 'nullable', 'string', 'max:255'],
            'district' => ['sometimes', 'string', 'max:100'],
            'subcounty' => ['sometimes', 'nullable', 'string', 'max:100'],
            'village' => ['sometimes', 'nullable', 'string', 'max:100'],
            'business_type' => ['sometimes', 'nullable', 'string', 'max:100'],
            'monthly_income_range' => ['sometimes', 'nullable', 'string', 'max:50'],
            'income_bracket' => [
                'sometimes',
                'in:under_100k,100k_300k,300k_600k,600k_1m,over_1m',
            ],
            'education_level' => [
                'sometimes',
                'in:none,primary,secondary,tertiary,vocational',
            ],
            'password' => ['sometimes', 'nullable', 'string', 'min:8', 'confirmed'],
        ];
    }
}