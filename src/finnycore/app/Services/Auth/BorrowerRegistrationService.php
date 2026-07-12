<?php

namespace App\Services\Auth;

use App\Models\Borrower;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;

class BorrowerRegistrationService
{
    /**
     * Creates a borrower record and stores the two KYC images on the
     * private disk. Password and file paths are set via forceFill()
     * from inside this method only — they are not in Borrower's
     * $fillable list (see Borrower model docblock).
     */
    public function register(array $data, UploadedFile $ninImage, UploadedFile $livelinessImage): Borrower
    {
        $ninPath = $ninImage->store('kyc/nin', 'private');
        $livelinessPath = $livelinessImage->store('kyc/liveliness', 'private');

        // Borrower::$fillable intentionally excludes password.
        // Since the DB column is NOT NULL, we must set the password hash
        // via forceFill() BEFORE the first save/insert.
        $passwordHash = Hash::make($data['password']);

        $borrower = new Borrower([
            'full_name' => $data['full_name'],
            'date_of_birth' => $data['date_of_birth'],
            'phone_number' => $data['phone_number'],
            'email' => $data['email'] ?? null,
            'monthly_income_range' => $data['monthly_income_range'] ?? null,
            'income_bracket' => $data['income_bracket'],
            'business_type' => $data['business_type'] ?? null,
            'address' => $data['address'] ?? null,
            'district' => $data['district'],
            'subcounty' => $data['subcounty'] ?? null,
            'village' => $data['village'] ?? null,
            'education_level' => $data['education_level'],
            'status' => 'pending_kyc',
        ]);

        $borrower->forceFill([
            'password' => $passwordHash,
            'nin_image_path' => $ninPath,
            'liveliness_check_path' => $livelinessPath,
            'liveliness_verified' => false,
            'terms_accepted_at' => now(),
            'status' => 'active',
        ])->save();

        return $borrower->fresh();
    }
}