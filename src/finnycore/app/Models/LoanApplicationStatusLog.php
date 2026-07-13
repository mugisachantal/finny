<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoanApplicationStatusLog extends Model
{
    public $timestamps = false;
    protected $fillable = ['loan_application_id', 'from_status', 'to_status', 'note', 'created_at'];
}