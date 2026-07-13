<?php

namespace App\Models;
// app/Models/Lender.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lender extends Model
{
    protected $fillable = [
        'name', 'code', 'description', 'integration_type', 'api_base_url',
        'api_auth_type', 'application_schema', 'terms_and_conditions',
        'min_loan_amount', 'max_loan_amount', 'interest_rate_min', 'interest_rate_max',
        'duration_options', 'commission_disbursement_pct', 'commission_repayment_pct',
        'status',
    ];

    // api_auth_credentials is deliberately not fillable — only ever set via
    // LenderOnboardingService::storeCredentials(), never mass assignment.
    protected $hidden = ['api_auth_credentials'];

    protected $casts = [
        'application_schema' => 'array',
        'duration_options' => 'array',
        'api_auth_credentials' => 'encrypted:array', // decrypted only when accessed
        'onboarded_at' => 'datetime',
        'min_loan_amount' => 'decimal:2',
        'max_loan_amount' => 'decimal:2',
        'interest_rate_min' => 'decimal:2',
        'interest_rate_max' => 'decimal:2',
        'ranking_score' => 'decimal:2',
    ];

    public function credentials()
    {
        return $this->hasMany(LenderCredential::class);
    }

    public function loanApplications()
    {
        return $this->hasMany(LoanApplication::class);
    }

    public function acceptsAmount(float $amount): bool
    {
        return $amount >= (float) $this->min_loan_amount
            && $amount <= (float) $this->max_loan_amount;
    }

    public function acceptsDuration(int $value, string $unit): bool
    {
        foreach ($this->duration_options as $option) {
            if ($option['unit'] === $unit && $value >= $option['min'] && $value <= $option['max']) {
                return true;
            }
        }
        return false;
    }
}