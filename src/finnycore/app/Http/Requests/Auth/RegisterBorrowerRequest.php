<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterBorrowerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:150'],
            'date_of_birth' => ['required', 'date', 'before:-18 years'],
            'email' => ['required', 'email', 'max:255', 'unique:borrowers,email'],
            'phone_number' => [
                'nullable', 'string', 'regex:/^\+256[0-9]{9}$/',
                'unique:borrowers,phone_number',
            ],
            'password' => ['required', 'string', 'min:8', 'confirmed'],

            'monthly_income_range' => ['nullable', 'string', 'max:50'],
            'income_bracket' => [
                'required',
                'in:under_100k,100k_300k,300k_600k,600k_1m,over_1m',
            ],
            'business_type' => ['nullable', 'string', 'max:100'],

            'address' => ['nullable', 'string', 'max:255'],
            'district' => ['required', 'string', 'max:100'],
            'subcounty' => ['nullable', 'string', 'max:100'],
            'village' => ['nullable', 'string', 'max:100'],

            'education_level' => [
                'required',
                'in:none,primary,secondary,tertiary,vocational',
            ],

            'nin_image' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:4096'],
            'liveliness_image' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:4096'],

            'terms_accepted' => ['required', 'accepted'],
        ];
    }

    public function messages(): array
    {
        return [
            'phone_number.regex' => 'Phone number must be in the format +2567XXXXXXXX.',
            'date_of_birth.before' => 'You must be at least 18 years old to register.',
            'terms_accepted.accepted' => 'You must accept the Terms and Conditions to continue.',
            'nin_image.required' => 'A photo of your National ID is required.',
            'liveliness_image.required' => 'A verification photo is required.',
        ];
    }

    /**
     * Only the plain-data fields — used by BorrowerRegistrationService.
     * The two uploaded files are pulled separately in the controller
     * via $request->file(...), since they are not part of the model's
     * fillable attributes and are handled by dedicated storage logic.
     */
    public function registrationData(): array
    {
        return collect($this->validated())
            ->except(['nin_image', 'liveliness_image', 'terms_accepted', 'password_confirmation'])
            ->toArray();
    }
}