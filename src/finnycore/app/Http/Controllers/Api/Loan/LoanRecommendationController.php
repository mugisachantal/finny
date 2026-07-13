<?php
namespace App\Http\Controllers\Api\Loan;

use App\Http\Controllers\Controller;
use App\Http\Requests\Loan\LoanRecommendationRequest;
use App\Services\Loan\LoanRecommendationService;
use Illuminate\Http\JsonResponse;

class LoanRecommendationController extends Controller
{
    public function __construct(private readonly LoanRecommendationService $recommendation) {}

    public function store(LoanRecommendationRequest $request): JsonResponse
    {
        $result = $this->recommendation->recommend($request->user(), $request->validated());

        if (empty($result['recommendations'])) {
            return response()->json([
                'message' => 'No lenders currently match this loan request.',
                'data' => ['token' => null, 'recommendations' => []],
            ]);
        }

        return response()->json([
            'message' => 'Top matching lenders found.',
            'data' => $result,
        ]);
    }
}