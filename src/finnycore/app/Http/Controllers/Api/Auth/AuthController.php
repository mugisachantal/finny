<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterBorrowerRequest;
use App\Http\Resources\BorrowerResource;
use App\Services\Auth\BorrowerAuthService;
use App\Services\Auth\BorrowerRegistrationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private readonly BorrowerRegistrationService $registration,
        private readonly BorrowerAuthService $auth,
    ) {}

    public function register(RegisterBorrowerRequest $request): JsonResponse
    {
        $borrower = $this->registration->register(
            $request->registrationData(),
            $request->file('nin_image'),
            $request->file('liveliness_image'),
        );

        $token = $borrower->createToken('finny-web')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful.',
            'data' => [
                'borrower' => new BorrowerResource($borrower),
                'token' => $token,
            ],
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->auth->attempt(
            $request->validated('phone_number'),
            $request->validated('password'),
        );

        return response()->json([
            'message' => 'Login successful.',
            'data' => [
                'borrower' => new BorrowerResource($result['borrower']),
                'token' => $result['token'],
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->auth->logout($request->user());

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}