<?php
namespace App\Http\Controllers\Api\Loan;

use App\Http\Controllers\Controller;
use App\Models\AiInsight;
use App\Models\Lender;
use Illuminate\Http\JsonResponse;

/**
 * Pure reads against pre-computed rows — this is the "instant
 * retrieval" endpoint referenced in the spec. No AI call happens on
 * this request path.
 */
class InsightsController extends Controller
{
    public function forLender(Lender $lender): JsonResponse
    {
        $insights = AiInsight::where('subject_type', 'lender')
            ->where('subject_id', $lender->id)
            ->get()
            ->keyBy('insight_type')
            ->map(fn (AiInsight $i) => $i->payload);

        return response()->json(['data' => $insights]);
    }
}