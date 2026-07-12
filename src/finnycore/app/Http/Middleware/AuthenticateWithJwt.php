<?php

namespace App\Http\Middleware;

use App\Models\Borrower;
use App\Services\Auth\JwtService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateWithJwt
{
    public function __construct(private readonly JwtService $jwt) {}

    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        try {
            $claims   = $this->jwt->verify($token);
            $borrower = Borrower::findOrFail($claims['sub']);
            $request->setUserResolver(fn () => $borrower);
        } catch (\Exception) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        return $next($request);
    }
}
