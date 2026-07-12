<?php

namespace App\Services\Auth;

use App\Models\Borrower;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class BorrowerAuthService
{
    /**
     * Returns ['borrower' => Borrower, 'token' => string].
     *
     * Throws a ValidationException (not a raw exception) on bad
     * credentials or a suspended account, so the controller returns a
     * clean 422 without needing an if/else chain of its own. The error
     * message deliberately does not distinguish between "phone not
     * found" and "wrong password", to prevent account enumeration.
     */
    public function attempt(string $phoneNumber, string $password): array
    {
        $borrower = Borrower::where('phone_number', $phoneNumber)->first();

        if (! $borrower || ! Hash::check($password, $borrower->password)) {
            throw ValidationException::withMessages([
                'phone_number' => ['Invalid phone number or password.'],
            ]);
        }

        if ($borrower->status === 'suspended') {
            throw ValidationException::withMessages([
                'phone_number' => ['This account has been suspended. Please contact support.'],
            ]);
        }

        $token = $borrower->createToken('finny-web')->plainTextToken;

        return ['borrower' => $borrower, 'token' => $token];
    }

    public function logout(Borrower $borrower): void
    {
        $borrower->currentAccessToken()->delete();
    }
}