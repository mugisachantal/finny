<?php
namespace App\Services\Loan;

use App\Models\Borrower;
use App\Models\Lender;
use App\Models\LoanApplication;
use App\Services\Lender\CredentialProvisioningService;
use App\Services\Lender\LenderApplicationGateway;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

class LoanApplicationService
{
    public function __construct(
        private readonly CredentialProvisioningService $credentials,
        private readonly LenderApplicationGateway $gateway,
    ) {}

    public function submit(Borrower $borrower, Lender $lender, string $recommendationToken, array $manualFields): LoanApplication
    {
        $cached = Cache::get("loan_recommendation:{$recommendationToken}");

        if (! $cached || $cached['borrower_id'] !== $borrower->id) {
            throw ValidationException::withMessages([
                'recommendation_token' => ['This recommendation has expired. Please search again.'],
            ]);
        }

        $recommendedIds = array_column($cached['recommendations'], 'lender_id');
        if (! in_array($lender->id, $recommendedIds, true)) {
            // Enforced rule: a borrower may only submit to a lender the
            // recommendation engine actually returned, never bypass it.
            throw ValidationException::withMessages([
                'lender_id' => ['You may only apply to a lender from your recommended list.'],
            ]);
        }

        $payload = $this->mergePayload($lender, $borrower, $manualFields);

        $application = LoanApplication::create([
            'borrower_id' => $borrower->id,
            'lender_id' => $lender->id,
            'requested_amount' => $cached['loan_request']['requested_amount'],
            'purpose' => $cached['loan_request']['purpose'],
            'repayment_cycle' => $cached['loan_request']['repayment_cycle'],
            'proposed_interest_rate' => $cached['loan_request']['proposed_interest_rate'] ?? null,
            'duration_value' => $cached['loan_request']['duration_value'],
            'duration_unit' => $cached['loan_request']['duration_unit'],
            'recommendation_snapshot' => $cached['recommendations'],
            'submitted_payload' => $payload,
            'status' => 'submitted',
        ]);

        $this->logStatus($application, null, 'submitted');

        $credential = $this->credentials->ensureAccount($borrower, $lender);
        $result = $this->gateway->submitApplication($lender, $credential, $payload);

        if ($result['success']) {
            $application->update([
                'lender_reference_id' => $result['reference_id'],
                'status' => 'pending_verification',
            ]);
            $this->logStatus($application, 'submitted', 'pending_verification');
        }

        Cache::forget("loan_recommendation:{$recommendationToken}");

        return $application->fresh();
    }

    /**
     * profile_field values are always pulled fresh from the borrower
     * record here, never taken from client input — this is the
     * server-side enforcement point for the "read-only" fields the
     * frontend displays.
     */
    private function mergePayload(Lender $lender, Borrower $borrower, array $manualFields): array
    {
        $payload = [];

        foreach ($lender->application_schema as $field) {
            $payload[$field['key']] = $field['source'] === 'profile_field'
                ? data_get($borrower, $field['profile_field'])
                : ($manualFields[$field['key']] ?? null);
        }

        return $payload;
    }

    private function logStatus(LoanApplication $application, ?string $from, string $to): void
    {
        $application->statusLogs()->create([
            'from_status' => $from,
            'to_status' => $to,
            'created_at' => now(),
        ]);
    }
}