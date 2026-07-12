<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Deliberately never includes nin_image_path or liveliness_check_path,
 * even though both are already hidden on the model. Excluding them
 * again here means this resource stays safe to reuse even if the
 * model's $hidden array is ever changed elsewhere.
 */
class BorrowerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'phone_number' => $this->phone_number,
            'email' => $this->email,

            'address' => $this->address,
            'district' => $this->district,
            'subcounty' => $this->subcounty,
            'village' => $this->village,
            'region' => $this->region,

            'business_type' => $this->business_type,
            'monthly_income_range' => $this->monthly_income_range,
            'income_bracket' => $this->income_bracket,
            'education_level' => $this->education_level,
            'age_bracket' => $this->age_bracket,

            'status' => $this->status,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}