<?php

// database/migrations/2026_07_12_090000_create_lenders_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lenders', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('code', 50)->unique(); // slug used in mock gateway URLs, e.g. 'fido'
            $table->text('description')->nullable();

            // Onboarding path — see design note in LenderOnboardingService.
            $table->enum('integration_type', ['api', 'manual_form']);
            $table->string('api_base_url'); // always set — for manual_form lenders this
                                             // points at Finny's own mock gateway (see
                                             // MockLenderGatewayController) so the
                                             // submission pipeline is identical either way.
            $table->enum('api_auth_type', ['api_key', 'oauth_client_credentials', 'none'])
                ->default('api_key');

            // Encrypted at rest via the Eloquent 'encrypted:array' cast — see Lender model.
            $table->text('api_auth_credentials')->nullable();

            // Array of field definitions. Each entry:
            // { key, label, type, required, source: 'profile_field'|'manual',
            //   profile_field?: 'phone_number', options?: [...] }
            $table->jsonb('application_schema');

            $table->text('terms_and_conditions')->nullable();

            $table->decimal('min_loan_amount', 12, 2);
            $table->decimal('max_loan_amount', 12, 2);
            $table->decimal('interest_rate_min', 5, 2); // percent
            $table->decimal('interest_rate_max', 5, 2);

            // Array of accepted duration windows, e.g.
            // [{"unit":"month","min":1,"max":12},{"unit":"week","min":1,"max":4}]
            $table->jsonb('duration_options');

            $table->decimal('commission_disbursement_pct', 5, 2)->default(0);
            $table->decimal('commission_repayment_pct', 5, 2)->default(0);

            $table->decimal('ranking_score', 5, 2)->default(50.00); // neutral start,
                                                                     // adjusted by complaints

            $table->enum('status', ['pending_review', 'active', 'suspended'])
                ->default('pending_review');
            $table->timestamp('onboarded_at')->nullable();

            $table->timestamps();

            $table->index('status');
            $table->index(['min_loan_amount', 'max_loan_amount']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lenders');
    }
};