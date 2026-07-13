<?php
// app/Http/Requests/Lender/RegisterLenderRequest.php

namespace App\Http\Requests\Lender;

use Illuminate\Foundation\Http\FormRequest;

class RegisterLenderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // gated by admin auth/RBAC middleware on the route, not here
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'code' => ['required', 'string', 'alpha_dash', 'max:50', 'unique:lenders,code'],
            'description' => ['nullable', 'string'],

            'integration_type' => ['required', 'in:api,manual_form'],
            // required only when the lender has a real live API — for
            // manual_form lenders the service fills this with the mock
            // gateway URL, so it is not required from the admin here.
            'api_base_url' => ['required_if:integration_type,api', 'nullable', 'url'],
            'api_auth_type' => ['required', 'in:api_key,oauth_client_credentials,none'],
            'api_key' => ['required_if:api_auth_type,api_key', 'nullable', 'string'],
            'oauth_client_id' => ['required_if:api_auth_type,oauth_client_credentials', 'nullable', 'string'],
            'oauth_client_secret' => ['required_if:api_auth_type,oauth_client_credentials', 'nullable', 'string'],

            'application_schema' => ['required', 'array', 'min:1'],
            'application_schema.*.key' => ['required', 'string'],
            'application_schema.*.label' => ['required', 'string'],
            'application_schema.*.type' => ['required', 'in:text,number,select,date,phone,file'],
            'application_schema.*.required' => ['required', 'boolean'],
            'application_schema.*.source' => ['required', 'in:profile_field,manual'],
            'application_schema.*.profile_field' => ['required_if:application_schema.*.source,profile_field', 'nullable', 'string'],
            'application_schema.*.options' => ['nullable', 'array'],

            'terms_and_conditions' => ['nullable', 'string'],

            'min_loan_amount' => ['required', 'numeric', 'min:0'],
            'max_loan_amount' => ['required', 'numeric', 'gte:min_loan_amount'],
            'interest_rate_min' => ['required', 'numeric', 'min:0'],
            'interest_rate_max' => ['required', 'numeric', 'gte:interest_rate_min'],

            'duration_options' => ['required', 'array', 'min:1'],
            'duration_options.*.unit' => ['required', 'in:day,week,month,year'],
            'duration_options.*.min' => ['required', 'integer', 'min:1'],
            'duration_options.*.max' => ['required', 'integer', 'gte:duration_options.*.min'],

            'commission_disbursement_pct' => ['required', 'numeric', 'min:0', 'max:100'],
            'commission_repayment_pct' => ['required', 'numeric', 'min:0', 'max:100'],
        ];
    }
}