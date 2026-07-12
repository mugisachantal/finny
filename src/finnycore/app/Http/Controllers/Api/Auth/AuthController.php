<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterBorrowerRequest;
use App\Http\Resources\BorrowerResource;
use App\Services\Auth\BorrowerAuthService;
use App\Services\Auth\BorrowerRegistrationService;
use App\Services\Auth\JwtService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private readonly BorrowerRegistrationService $registration,
        private readonly BorrowerAuthService $auth,
        private readonly JwtService $jwt,
    ) {}

    public function register(RegisterBorrowerRequest $request): JsonResponse
    {
        $borrower = $this->registration->register(
            $request->registrationData(),
            $request->file('nin_image'),
            $request->file('liveliness_image'),
        );

        return response()->json([
            'message' => 'Registration successful.',
            'data' => [
                'borrower' => new BorrowerResource($borrower),
                'token'    => $this->jwt->issue($borrower),
            ],
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->auth->attempt(
            $request->validated('email'),
            $request->validated('password'),
        );

        return response()->json([
            'message' => 'Login successful.',
            'data' => [
                'borrower' => new BorrowerResource($result['borrower']),
                'token'    => $result['token'],
            ],
        ]);
    }

    public function logout(): JsonResponse
    {
        $this->auth->logout();

        return response()->json(['message' => 'Logged out successfully.']);
    }
}