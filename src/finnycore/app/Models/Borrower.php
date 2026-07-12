<?php

namespace App\Models;


use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property-read string $age_bracket
 * @property-read string $region
 */
class Borrower extends Authenticatable
{
    use HasApiTokens, Notifiable, SoftDeletes;

    protected $table = 'borrowers';

    /**
     * Deliberately excludes: password, nin_image_path, liveliness_check_path.
     * Those three fields are only ever written from inside
     * BorrowerRegistrationService, never through mass assignment, so a
     * stray Borrower::update($request->all()) elsewhere in the codebase
     * can never overwrite a password hash or a KYC document path.
     */
    protected $fillable = [
        'full_name',
        'date_of_birth',
        'phone_number',
        'email',
        'monthly_income_range',
        'income_bracket',
        'business_type',
        'address',
        'district',
        'subcounty',
        'village',
        'education_level',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'nin_image_path',
        'liveliness_check_path',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'terms_accepted_at' => 'datetime',
        'phone_verified_at' => 'datetime',
        'liveliness_verified' => 'boolean',
    ];

    /**
     * Computed at read time from date_of_birth so it never goes stale
     * as the borrower ages across a bracket boundary. Used by the
     * chatbot system prompt and the recommendation engine.
     */
    public function getAgeBracketAttribute(): string
    {
        $age = $this->date_of_birth?->age;

        if ($age === null) {
            return 'unknown';
        }

        return match (true) {
            $age < 26 => 'young_adult_18_25',
            $age < 41 => 'adult_26_40',
            $age < 61 => 'middle_aged_41_60',
            default => 'senior_60_plus',
        };
    }

    /**
     * Coarser grouping than district, used for chatbot/recommendation
     * tuning. Derived rather than stored so the district-to-region
     * mapping can be corrected later without a data migration.
     */
    public function getRegionAttribute(): string
    {
        // District-to-region mapping helper may not exist in all deployments.
        // Fail gracefully to avoid breaking registration responses.
        if (!class_exists(\App\Support\DistrictRegionMap::class)) {
            return 'unknown';
        }

        return \App\Support\DistrictRegionMap::regionFor($this->district);
    }


    public function loanApplications()
    {
        return $this->hasMany(\App\Models\LoanApplication::class);
    }

    public function complaints()
    {
        return $this->hasMany(\App\Models\Complaint::class);
    }
}