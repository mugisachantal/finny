<?php

// database/migrations/2026_07_12_090300_create_ai_insights_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_insights', function (Blueprint $table) {
            $table->id();
            $table->enum('subject_type', ['lender', 'borrower', 'platform']);
            $table->unsignedBigInteger('subject_id')->nullable(); // null for platform-wide
            $table->string('insight_type', 60); // risk_score, trust_badge, limit_growth_metric, platform_summary
            $table->jsonb('payload');
            $table->timestamp('generated_at');
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->unique(['subject_type', 'subject_id', 'insight_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_insights');
    }
};
