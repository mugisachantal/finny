<?php
namespace App\Services\Loan;

use App\Models\Borrower;
use App\Models\Lender;

/**
 * Merges a lender's stored schema with the authenticated borrower's
 * profile. Every field of source 'profile_field' comes back with its
 * current value pre-filled and readonly: true — the frontend renders it
 * but never lets the user edit it, since the server will overwrite any
 * client-supplied value for these fields anyway (see
 * LoanApplicationService::mergePayload()).
 */
class DynamicLoanFormSchemaService
{
    public function resolveForBorrower(Lender $lender, Borrower $borrower): array
    {
        return collect($lender->application_schema)->map(function (array $field) use ($borrower) {
            if ($field['source'] === 'profile_field') {
                $field['value'] = data_get($borrower, $field['profile_field']);
                $field['readonly'] = true;
            } else {
                $field['value'] = null;
                $field['readonly'] = false;
            }

            return $field;
        })->values()->all();
    }
}