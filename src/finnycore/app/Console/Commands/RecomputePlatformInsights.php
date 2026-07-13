<?php
namespace App\Console\Commands;

use App\Models\AiInsight;
use App\Models\LoanApplication;
use App\Services\Intelligence\IntelligenceApiClient;
use Illuminate\Console\Command;

/**
 * Scheduled recurring job — see routes/console.php. Pre-computes
 * platform-wide insights from loan history so any later "insights"
 * endpoint is a pure database read with zero AI-call latency.
 */
class RecomputePlatformInsights extends Command
{
    protected $signature = 'finny:recompute-platform-insights';
    protected $description = 'Recomputes platform-wide AI insights from loan application history.';

    public function handle(IntelligenceApiClient $intelligence): void
    {
        $stats = [
            'total_applications' => LoanApplication::count(),
            'disbursed_count' => LoanApplication::where('status', 'disbursed')->count(),
            'repaid_count' => LoanApplication::where('status', 'repaid')->count(),
            'defaulted_count' => LoanApplication::where('status', 'defaulted')->count(),
            'applications_by_lender' => LoanApplication::selectRaw('lender_id, count(*) as total')
                ->groupBy('lender_id')->pluck('total', 'lender_id'),
        ];

        $result = $intelligence->recomputePlatformInsights($stats);
        if (empty($result)) {
            return;
        }

        AiInsight::updateOrCreate(
            ['subject_type' => 'platform', 'subject_id' => null, 'insight_type' => 'platform_summary'],
            ['payload' => $result, 'generated_at' => now()],
        );
    }
}