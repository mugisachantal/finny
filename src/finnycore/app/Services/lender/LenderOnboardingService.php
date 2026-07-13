<?php
namespace App\Services\Lender;

use App\Models\Lender;
use App\Jobs\GenerateLenderInsightsJob;
use Illuminate\Support\Str;

/**
 * Handles both onboarding paths from a single method. Design decision:
 * whichever path is chosen at onboarding, submission at loan-application
 * time always POSTs to $lender->api_base_url. For a 'manual_form' lender
 * (one with no live API, whose form was simply registered by an admin)
 * this method points api_base_url at Finny's own mock gateway
 * (MockLenderGatewayController), which stands in for that lender's
 * backend for the MVP demo. This keeps LenderApplicationGateway a single
 * implementation instead of two adapter classes that would otherwise
 * diverge — the "mocked for MVP" requirement is satisfied at the URL
 * level, not by branching the submission code path.
 */
class LenderOnboardingService
{
    public function register(array $data): Lender
    {
        $baseUrl = $data['integration_type'] === 'manual_form'
            ? config('services.mock_lender_gateway.url') . '/mock/lenders/' . $data['code']
            : $data['api_base_url'];

        $lender = Lender::create([
            'name' => $data['name'],
            'code' => $data['code'],
            'description' => $data['description'] ?? null,
            'integration_type' => $data['integration_type'],
            'api_base_url' => $baseUrl,
            'api_auth_type' => $data['api_auth_type'],
            'application_schema' => $data['application_schema'],
            'terms_and_conditions' => $data['terms_and_conditions'] ?? null,
            'min_loan_amount' => $data['min_loan_amount'],
            'max_loan_amount' => $data['max_loan_amount'],
            'interest_rate_min' => $data['interest_rate_min'],
            'interest_rate_max' => $data['interest_rate_max'],
            'duration_options' => $data['duration_options'],
            'commission_disbursement_pct' => $data['commission_disbursement_pct'],
            'commission_repayment_pct' => $data['commission_repayment_pct'],
            'status' => 'pending_review',
        ]);

        $this->storeCredentials($lender, $data);

        return $lender;
    }

    /**
     * Stores lender-platform auth credentials (Finny -> lender, not
     * borrower -> lender) encrypted via the 'encrypted:array' cast on
     * the Lender model. Bypasses mass assignment deliberately.
     */
    protected function storeCredentials(Lender $lender, array $data): void
    {
        $credentials = match ($data['api_auth_type']) {
            'api_key' => ['api_key' => $data['api_key']],
            'oauth_client_credentials' => [
                'client_id' => $data['oauth_client_id'],
                'client_secret' => $data['oauth_client_secret'],
            ],
            default => [],
        };

        $lender->forceFill(['api_auth_credentials' => $credentials])->save();
    }

    /**
     * Admin marks a lender live. This is the trigger point for the
     * asynchronous AI insight generation described in the spec — insight
     * generation is dispatched here, not computed inline, so approval
     * stays fast regardless of Groq latency.
     */
    public function approve(Lender $lender): Lender
    {
        $lender->update(['status' => 'active', 'onboarded_at' => now()]);

        GenerateLenderInsightsJob::dispatch($lender->id);

        return $lender->fresh();
    }

    public function suspend(Lender $lender): Lender
    {
        $lender->update(['status' => 'suspended']);
        return $lender->fresh();
    }
}