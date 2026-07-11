<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('borrowers', function (Blueprint $table) {
            $table->id();

            // Identity
            $table->string('full_name', 150);
            $table->date('date_of_birth');
            $table->string('phone_number', 20)->unique();
            $table->string('email')->nullable()->unique();
            $table->string('password');

            // Financial / recommendation-engine inputs
            $table->string('monthly_income_range', 50)->nullable();
            $table->enum('income_bracket', [
                'under_100k', '100k_300k', '300k_600k', '600k_1m', 'over_1m',
            ]);
            $table->string('business_type', 100)->nullable();

            // Location
            $table->string('address')->nullable();
            $table->string('district', 100);
            $table->string('subcounty', 100)->nullable();
            $table->string('village', 100)->nullable();

            // KYC (paths only — never exposed via API)
            $table->string('nin_image_path')->nullable();
            $table->string('liveliness_check_path')->nullable();
            $table->boolean('liveliness_verified')->default(false);

            // Chatbot / literacy tuning
            $table->enum('education_level', [
                'none', 'primary', 'secondary', 'tertiary', 'vocational',
            ]);

            // Compliance
            $table->timestamp('terms_accepted_at')->nullable();
            $table->timestamp('phone_verified_at')->nullable();

            // Lifecycle
            $table->enum('status', ['pending_kyc', 'active', 'suspended'])
                ->default('pending_kyc');

            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();

            $table->index('district');
            $table->index('status');
            $table->index('income_bracket');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('borrowers');
    }
};