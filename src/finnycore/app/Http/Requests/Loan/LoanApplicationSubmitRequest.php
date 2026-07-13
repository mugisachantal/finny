<?php
namespace App\Http\Requests\Loan;

use App\Models\Lender;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Validation rules are built dynamically from the chosen lender's
 * application_schema rather than being static — every lender's manual
 * fields differ. Only fields with source = 'manual' get a rule here;
 * profile_field entries are never validated against client input at
 * all, since the server always re-derives them from the authenticated
 * borrower and ignores anything the client sends for those keys.
 */
class LoanApplicationSubmitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        /** @var Lender $lender */
        $lender = $this->route('lender');

        $rules = [
            'recommendation_token' => ['required', 'uuid'],
            'fields' => ['required', 'array'],
        ];

        foreach ($lender->application_schema as $field) {
            if ($field['source'] !== 'manual') {
                continue;
            }

            $rules["fields.{$field['key']}"] = $field['required']
                ? ['required']
                : ['nullable'];
        }

        return $rules;
    }
}