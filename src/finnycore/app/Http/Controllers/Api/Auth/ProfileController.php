<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Resources\BorrowerResource;
use App\Models\Borrower;
use App\Services\Auth\BorrowerProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function __construct(
        private readonly BorrowerProfileService $profiles,
    ) {}

    public function show(Request $request): JsonResponse
    {
        /** @var Borrower $borrower */
        $borrower = $request->user();

        return response()->json([
            'message' => 'Profile loaded successfully.',
            'data' => new BorrowerResource($borrower),
        ]);
    }

    public function update(UpdateProfileRequest $request): JsonResponse
    {
        /** @var Borrower $borrower */
        $borrower = $request->user();

        $updatedBorrower = $this->profiles->update($borrower, $request->validated());

        return response()->json([
            'message' => 'Profile updated successfully.',
            'data' => new BorrowerResource($updatedBorrower),
        ]);
    }
}