<?php
namespace App\Services\Intelligence;

use App\Models\Borrower;

/**
 * Allow-list, not a deny-list. Rather than trying to enumerate every
 * sensitive field and strip it (fragile — a new column added later could
 * leak silently), this returns only the fields explicitly known to be
 * safe and useful for AI context. Anything not listed here never leaves
 * this class, by construction.
 */
class PiiSanitizer
{
    public function borrowerContext(Borrower $borrower): array
    {
        return [
            'age_bracket' => $borrower->age_bracket,
            'region' => $borrower->region,
            'education_level' => $borrower->education_level,
            'income_bracket' => $borrower->income_bracket,
            'business_type' => $borrower->business_type,
        ];
    }
}