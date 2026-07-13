<?php
namespace App\Services\Lender;

use App\Models\Borrower;
use App\Models\Lender;
use App\Models\LenderCredential;
use App\Services\Lender\LenderApplicationGateway;
use Illuminate\Support\Str;

class CredentialProvisioningService
{
    public function __construct(private readonly LenderApplicationGateway $gateway) {}

    /**
     * Idempotent — if the borrower already has an account with this
     * lender, the existing credential row is returned unchanged rather
     * than creating a duplicate account at the lender's side.
     */
    public function ensureAccount(Borrower $borrower, Lender $lender): LenderCredential
    {
        $existing = LenderCredential::where('borrower_id', $borrower->id)
            ->where('lender_id', $lender->id)
            ->first();

        if ($existing) {
            return $existing;
        }

        $plaintextPassword = Str::password(20); // complex, single-use, never reused elsewhere

        $accountReference = $this->gateway->createAccount($lender, [
            'username' => $borrower->phone_number,
            'password' => $plaintextPassword,
            'full_name' => $borrower->full_name,
        ]);

        $credential = new LenderCredential([
            'borrower_id' => $borrower->id,
            'lender_id' => $lender->id,
            'lender_side_username' => $borrower->phone_number,
            'lender_account_reference' => $accountReference,
            'provisioned_at' => now(),
        ]);

        // Set via forceFill, same pattern as password hashing elsewhere —
        // never mass-assignable. The 'encrypted' cast on the model
        // encrypts this the moment it is saved.
        $credential->forceFill(['lender_side_password' => $plaintextPassword]);
        $credential->save();

        // $plaintextPassword goes out of scope here and is not referenced
        // again anywhere in this method. It is never logged: no log
        // statement in this class ever touches it, by construction.
        unset($plaintextPassword);

        return $credential;
    }
}