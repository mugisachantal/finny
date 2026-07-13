<?php

// database/migrations/2026_07_12_090200_create_loan_applications_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loan_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('borrower_id')->constrained('borrowers');
            $table->foreignId('lender_id')->constrained('lenders');

            $table->decimal('requested_amount', 12, 2);
            $table->string('purpose', 255);
            $table->string('repayment_cycle', 30); // weekly, monthly, lump_sum
            $table->decimal('proposed_interest_rate', 5, 2)->nullable();
            $table->unsignedInteger('duration_value');
            $table->string('duration_unit', 10); // day, week, month, year

            // What the AI returned for this request (top 3 + rationale + scores),
            // kept for audit and as future training/feedback signal.
            $table->jsonb('recommendation_snapshot');

            // Exact payload sent to the lender, secrets excluded.
            $table->jsonb('submitted_payload')->nullable();

            $table->string('lender_reference_id')->nullable();

            $table->enum('status', [
                'draft', 'submitted', 'pending_verification',
                'approved', 'disbursed', 'repaid', 'rejected', 'defaulted',
            ])->default('draft');

            $table->timestamps();

            $table->index('borrower_id');
            $table->index('lender_id');
            $table->index('status');
        });

        Schema::create('loan_application_status_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_application_id')->constrained('loan_applications')->cascadeOnDelete();
            $table->string('from_status', 30)->nullable();
            $table->string('to_status', 30);
            $table->string('note', 255)->nullable();
            $table->timestamp('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loan_application_status_logs');
        Schema::dropIfExists('loan_applications');
    }
};