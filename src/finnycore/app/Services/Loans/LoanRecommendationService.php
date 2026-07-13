<?php
namespace App\Services\Loan;

use App\Models\Borrower;
use App\Models\Lender;
use App\Services\Intelligence\IntelligenceApiClient;
use App\Services\Intelligence\PiiSanitizer;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class LoanRecommendationService
{
    public function __construct(
        private readonly IntelligenceApiClient $intelligence,
        private readonly PiiSanitizer $sanitizer,
    ) {}

    /**
     * Returns ['token' => string, 'recommendations' => array]. The token
     * is a short-lived cache key the frontend must echo back when the
     * borrower submits their final application — see
     * LoanApplicationService::submit(). This is what enforces the rule
     * that a borrower can only submit to one of the three lenders the
     * engine actually recommended, not any lender in the directory.
     */
    public function recommend(Borrower $borrower, array $loanRequest): array
    {
        $eligible = $this->eligibleLenders($loanRequest);

        if ($eligible->isEmpty()) {
            return ['token' => null, 'recommendations' => []];
        }

        $recommendations = $this->intelligence->recommend(
            $this->sanitizer->borrowerContext($borrower),
            $loanRequest,
            $eligible->map(fn (Lender $l) => [
                'id' => $l->id,
                'name' => $l->name,
                'interest_rate_min' => $l->interest_rate_min,
                'interest_rate_max' => $l->interest_rate_max,
                'ranking_score' => $l->ranking_score,
            ])->all(),
        );

        $recommendations = array_slice($recommendations, 0, 3);

        $token = (string) Str::uuid();
        Cache::put("loan_recommendation:{$token}", [
            'borrower_id' => $borrower->id,
            'loan_request' => $loanRequest,
            'recommendations' => $recommendations,
        ], now()->addMinutes(30));

        return ['token' => $token, 'recommendations' => $this->withLenderDetails($recommendations)];
    }

    /**
     * Filters on amount range and duration before the request ever
     * reaches the Intelligence API — cheap relational filtering first,
     * AI scoring only on the shortlist. Keeps the prompt small and the
     * Groq call fast and inexpensive.
     */
    private function eligibleLenders(array $loanRequest)
    {
        return Lender::where('status', 'active')
            ->get()
            ->filter(fn (Lender $l) => $l->acceptsAmount($loanRequest['requested_amount'])
                && $l->acceptsDuration($loanRequest['duration_value'], $loanRequest['duration_unit']));
    }

    private function withLenderDetails(array $recommendations): array
    {
        $lenders = Lender::whereIn('id', array_column($recommendations, 'lender_id'))
            ->get()->keyBy('id');

        return collect($recommendations)->map(fn ($r) => [
            'lender_id' => $r['lender_id'],
            'name' => $lenders[$r['lender_id']]->name ?? null,
            'interest_rate_min' => $lenders[$r['lender_id']]->interest_rate_min ?? null,
            'interest_rate_max' => $lenders[$r['lender_id']]->interest_rate_max ?? null,
            'score' => $r['score'] ?? null,
            'rationale' => $r['rationale'] ?? null,
        ])->all();
    }
}