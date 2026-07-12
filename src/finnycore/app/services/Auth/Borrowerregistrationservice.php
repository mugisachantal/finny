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

        $borrower = Borrower::create([
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
            // MVP simplification: no manual KYC review queue exists yet
            // (see SDD 4.1.9). Status is flipped to 'active' below
            // immediately after the images are stored.
            'status' => 'pending_kyc',
        ]);

        $borrower->forceFill([
            'password' => Hash::make($data['password']),
            'nin_image_path' => $ninPath,
           // 'liveliness_check_path' => $livelinessPath,
            //'liveliness_verified' => false,
            'terms_accepted_at' => now(),
            'status' => 'active',
        ])->save();

        return $borrower->fresh();
    }
}