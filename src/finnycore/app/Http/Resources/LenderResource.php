<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LenderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'description' => $this->description,
            'integration_type' => $this->integration_type,
            'min_loan_amount' => $this->min_loan_amount,
            'max_loan_amount' => $this->max_loan_amount,
            'interest_rate_min' => $this->interest_rate_min,
            'interest_rate_max' => $this->interest_rate_max,
            'duration_options' => $this->duration_options,
            'status' => $this->status,
            'ranking_score' => $this->ranking_score,
            // api_base_url and api_auth_credentials are never exposed —
            // internal routing detail, not a borrower/frontend concern.
        ];
    }
}