<?php

namespace App\Services\Auth;

use App\Models\Borrower;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class BorrowerAuthService
{
    public function __construct(private readonly JwtService $jwt) {}

    public function attempt(string $email, string $password): array
    {
        $borrower = Borrower::where('email', $email)->first();

        // Deliberately indistinct error message to prevent account enumeration.
        if (! $borrower || ! Hash::check($password, $borrower->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid email or password.'],
            ]);
        }

        if ($borrower->status === 'suspended') {
            throw ValidationException::withMessages([
                'email' => ['This account has been suspended. Please contact support.'],
            ]);
        }

        return ['borrower' => $borrower, 'token' => $this->jwt->issue($borrower)];
    }

    public function logout(): void
    {
        // JWT is stateless — invalidation is handled client-side by discarding the token.
    }
}