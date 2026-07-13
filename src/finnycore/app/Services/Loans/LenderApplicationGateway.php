<?php
namespace App\Services\Lender;

use App\Models\Lender;
use App\Models\LenderCredential;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * The single implementation of the "Lender Adapter" concept referenced
 * elsewhere in the spec. Every lender, whether onboarded via a real API
 * or a manually-registered form, is reached through the same HTTP call
 * to $lender->api_base_url — see LenderOnboardingService for why that
 * URL points at a mock gateway for manual_form lenders. This class is
 * the one place in the codebase permitted to touch a decrypted lender
 * password, and only for the duration of a single method call.
 */
class LenderApplicationGateway
{
    public function createAccount(Lender $lender, array $data): ?string
    {
        $response = Http::withHeaders($this->authHeaders($lender))
            ->timeout(10)
            ->post("{$lender->api_base_url}/accounts", $data);

        return $response->successful() ? $response->json('account_reference') : null;
    }

    /**
     * Decrypts the credential's password strictly at this call site.
     * The decrypted value lives only in the $plaintextPassword local
     * variable, is used to build the outgoing request, and is unset
     * immediately after the HTTP call returns. Nothing in this method
     * logs the request body or the credential.
     */
    public function submitApplication(Lender $lender, LenderCredential $credential, array $payload): array
    {
        $plaintextPassword = $credential->lender_side_password; // decrypts here, in memory only

        $response = Http::withHeaders($this->authHeaders($lender))
            ->timeout(15)
            ->post("{$lender->api_base_url}/applications", array_merge($payload, [
                'account_username' => $credential->lender_side_username,
                'account_password' => $plaintextPassword,
            ]));

        unset($plaintextPassword);

        if ($response->failed()) {
            Log::warning('Lender application submission failed', [
                'lender_id' => $lender->id,
                'status' => $response->status(),
                // deliberately not logging the response or request body —
                // both may contain the account_password field above.
            ]);

            return ['success' => false, 'reference_id' => null];
        }

        return [
            'success' => true,
            'reference_id' => $response->json('reference_id'),
        ];
    }

    private function authHeaders(Lender $lender): array
    {
        $credentials = $lender->api_auth_credentials ?? [];

        return match ($lender->api_auth_type) {
            'api_key' => ['X-Api-Key' => $credentials['api_key'] ?? ''],
            'oauth_client_credentials' => ['Authorization' => 'Bearer ' . ($credentials['access_token'] ?? '')],
            default => [],
        };
    }
}