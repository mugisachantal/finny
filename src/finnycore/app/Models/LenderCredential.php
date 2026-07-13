<?php

// app/Models/LenderCredential.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LenderCredential extends Model
{
    protected $fillable = [
        'borrower_id', 'lender_id', 'lender_side_username',
        'lender_account_reference', 'provisioned_at',
    ];

    // lender_side_password is set only via forceFill() inside
    // CredentialProvisioningService — never mass-assignable.
    protected $hidden = ['lender_side_password'];

    protected $casts = [
        'lender_side_password' => 'encrypted', // decrypted only at point of access
        'provisioned_at' => 'datetime',
    ];

    public function borrower()
    {
        return $this->belongsTo(Borrower::class);
    }

    public function lender()
    {
        return $this->belongsTo(Lender::class);
    }
}
