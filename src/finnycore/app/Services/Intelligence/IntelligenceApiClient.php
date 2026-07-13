<?php
namespace App\Services\Intelligence;

use App\Models\Lender;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Thin wrapper around the Python/FastAPI Intelligence service, which
 * owns all direct Groq calls. Laravel never talks to Groq itself — this
 * keeps the Groq API key out of the PHP process entirely.
 */
class IntelligenceApiClient
{
    private string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.intelligence.url');
    }

    /**
     * Sends the sanitized borrower context, the loan request, and a
     * trimmed list of eligible lenders. Returns a structured JSON array:
     * [{lender_id, score, rationale}, ...] limited to 3 entries.
     */
    public function recommend(array $borrowerContext, array $loanRequest, array $eligibleLenders): array
    {
        $response = Http::baseUrl($this->baseUrl)
            ->timeout(10)
            ->post('/v1/recommend', [
                'borrower' => $borrowerContext,
                'loan_request' => $loanRequest,
                'lenders' => $eligibleLenders,
            ]);

        if ($response->failed()) {
            Log::warning('Intelligence API recommend() failed', ['status' => $response->status()]);
            return [];
        }

        return $response->json('recommendations', []);
    }

    public function analyzeLenderTerms(Lender $lender): array
    {
        $response = Http::baseUrl($this->baseUrl)
            ->timeout(15)
            ->post('/v1/lenders/analyze', [
                'lender_id' => $lender->id,
                'terms_and_conditions' => $lender->terms_and_conditions,
                'interest_rate_min' => $lender->interest_rate_min,
                'interest_rate_max' => $lender->interest_rate_max,
                'commission_disbursement_pct' => $lender->commission_disbursement_pct,
                'commission_repayment_pct' => $lender->commission_repayment_pct,
            ]);

        return $response->successful() ? $response->json() : [];
    }

    public function recomputePlatformInsights(array $aggregateStats): array
    {
        $response = Http::baseUrl($this->baseUrl)
            ->timeout(20)
            ->post('/v1/platform/insights', $aggregateStats);

        return $response->successful() ? $response->json() : [];
    }
}