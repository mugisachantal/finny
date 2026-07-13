<?php

// app/Models/AiInsight.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiInsight extends Model
{
    protected $fillable = [
        'subject_type', 'subject_id', 'insight_type', 'payload', 'generated_at', 'expires_at',
    ];

    protected $casts = [
        'payload' => 'array',
        'generated_at' => 'datetime',
        'expires_at' => 'datetime',
    ];
}