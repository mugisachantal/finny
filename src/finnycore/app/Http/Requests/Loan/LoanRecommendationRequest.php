<?php
namespace App\Http\Requests\Loan;

use Illuminate\Foundation\Http\FormRequest;

class LoanRecommendationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'requested_amount' => ['required', 'numeric', 'min:1'],
            'purpose' => ['required', 'string', 'max:255'],
            'repayment_cycle' => ['required', 'in:weekly,monthly,lump_sum'],
            'proposed_interest_rate' => ['nullable', 'numeric', 'min:0'],
            'duration_value' => ['required', 'integer', 'min:1'],
            'duration_unit' => ['required', 'in:day,week,month,year'],
        ];
    }
}