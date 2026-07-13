<?php

// app/Models/LoanApplication.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoanApplication extends Model
{
    protected $fillable = [
        'borrower_id', 'lender_id', 'requested_amount', 'purpose', 'repayment_cycle',
        'proposed_interest_rate', 'duration_value', 'duration_unit',
        'recommendation_snapshot', 'submitted_payload', 'lender_reference_id', 'status',
    ];

    protected $casts = [
        'recommendation_snapshot' => 'array',
        'submitted_payload' => 'array',
        'requested_amount' => 'decimal:2',
        'proposed_interest_rate' => 'decimal:2',
    ];

    public function borrower()
    {
        return $this->belongsTo(Borrower::class);
    }

    public function lender()
    {
        return $this->belongsTo(Lender::class);
    }

    public function statusLogs()
    {
        return $this->hasMany(LoanApplicationStatusLog::class);
    }
}