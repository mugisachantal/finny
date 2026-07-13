<?php
namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Lender\RegisterLenderRequest;
use App\Http\Resources\LenderResource;
use App\Models\Lender;
use App\Services\Lender\LenderOnboardingService;
use Illuminate\Http\JsonResponse;

class LenderOnboardingController extends Controller
{
    public function __construct(private readonly LenderOnboardingService $onboarding) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'data' => LenderResource::collection(Lender::latest()->paginate(25)),
        ]);
    }

    public function store(RegisterLenderRequest $request): JsonResponse
    {
        $lender = $this->onboarding->register($request->validated());

        return response()->json([
            'message' => 'Lender registered and pending review.',
            'data' => new LenderResource($lender),
        ], 201);
    }

    public function approve(Lender $lender): JsonResponse
    {
        $lender = $this->onboarding->approve($lender);

        return response()->json([
            'message' => 'Lender approved and now live.',
            'data' => new LenderResource($lender),
        ]);
    }

    public function suspend(Lender $lender): JsonResponse
    {
        $lender = $this->onboarding->suspend($lender);

        return response()->json([
            'message' => 'Lender suspended.',
            'data' => new LenderResource($lender),
        ]);
    }
}