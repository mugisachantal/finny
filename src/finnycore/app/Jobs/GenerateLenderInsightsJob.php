<?php
namespace App\Jobs;

use App\Models\AiInsight;
use App\Models\Lender;
use App\Services\Intelligence\IntelligenceApiClient;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Dispatched once, at the moment a lender is approved (see
 * LenderOnboardingService::approve()). Runs on the queue so approval
 * itself stays instant regardless of Groq latency, per the
 * batch-processing requirement.
 */
class GenerateLenderInsightsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(private readonly int $lenderId) {}

    public function handle(IntelligenceApiClient $intelligence): void
    {
        $lender = Lender::find($this->lenderId);
        if (! $lender) {
            return;
        }

        $result = $intelligence->analyzeLenderTerms($lender);
        if (empty($result)) {
            return;
        }

        foreach (['risk_score', 'trust_badge', 'limit_growth_metric'] as $type) {
            if (! isset($result[$type])) {
                continue;
            }

            AiInsight::updateOrCreate(
                ['subject_type' => 'lender', 'subject_id' => $lender->id, 'insight_type' => $type],
                ['payload' => $result[$type], 'generated_at' => now()],
            );
        }
    }
}