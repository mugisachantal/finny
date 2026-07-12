<?php

namespace App\Services\Auth;

use App\Models\Borrower;
use Illuminate\Support\Facades\Hash;

class BorrowerProfileService
{
    /**
     * If the password field is absent or blank, the existing hash is
     * preserved unchanged — it must never be overwritten with an
     * empty hash. This is the same rule used by the AdEMNEA Farmer
     * API for profile edits.
     */
    public function update(Borrower $borrower, array $data): Borrower
    {
        $borrower->fill(collect($data)->except(['password'])->toArray());

        if (! empty($data['password'])) {
            $borrower->password = Hash::make($data['password']);
        }

        $borrower->save();

        return $borrower->fresh();
    }
}