<?php

// database/migrations/2026_07_12_090100_create_lender_credentials_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lender_credentials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('borrower_id')->constrained('borrowers')->cascadeOnDelete();
            $table->foreignId('lender_id')->constrained('lenders')->cascadeOnDelete();

            $table->string('lender_side_username');
            $table->text('lender_side_password'); // encrypted at rest — see model cast
            $table->string('lender_account_reference')->nullable(); // ID returned by lender

            $table->timestamp('provisioned_at');
            $table->timestamps();

            $table->unique(['borrower_id', 'lender_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lender_credentials');
    }
};