<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Auth\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\LenderOnboardingController;
use App\Http\Controllers\Api\Loan\InsightsController;
use App\Http\Controllers\Api\Loan\LenderSchemaController;
use App\Http\Controllers\Api\Loan\LoanApplicationController;
use App\Http\Controllers\Api\Loan\LoanRecommendationController;
use App\Http\Controllers\Mock\MockLenderGatewayController;




/*
|--------------------------------------------------------------------------
| Finny Auth Module Routes
|--------------------------------------------------------------------------
| All list/error responses follow one envelope so the React client can
| use a single response-parsing layer:
|   success: { "message": "...", "data": ... }
|   error:   { "message": "...", "errors": { "field": ["..."] } }
*/

Route::prefix('v1/auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth.jwt')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('profile', [ProfileController::class, 'show']);
        Route::put('profile', [ProfileController::class, 'update']);
    });
});


// routes/api.php (additions)


Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    Route::post('loan-applications/recommendations', [LoanRecommendationController::class, 'store']);
    Route::get('lenders/{lender}/application-schema', [LenderSchemaController::class, 'show']);
    Route::post('lenders/{lender}/loan-applications', [LoanApplicationController::class, 'store']);
    Route::get('loan-applications', [LoanApplicationController::class, 'index']);
    Route::get('loan-applications/{loanApplication}', [LoanApplicationController::class, 'show']);
    Route::get('lenders/{lender}/insights', [InsightsController::class, 'forLender']);
});

Route::middleware(['auth:sanctum', 'permission:manage-lenders'])->prefix('v1/admin')->group(function () {
    Route::get('lenders', [LenderOnboardingController::class, 'index']);
    Route::post('lenders', [LenderOnboardingController::class, 'store']);
    Route::patch('lenders/{lender}/approve', [LenderOnboardingController::class, 'approve']);
    Route::patch('lenders/{lender}/suspend', [LenderOnboardingController::class, 'suspend']);
});

// Mock lender backend — stands in for lenders without real infrastructure.
Route::prefix('mock/lenders/{code}')->group(function () {
    Route::get('schema', [MockLenderGatewayController::class, 'schema']);
    Route::post('accounts', [MockLenderGatewayController::class, 'createAccount']);
    Route::post('applications', [MockLenderGatewayController::class, 'submitApplication']);
});