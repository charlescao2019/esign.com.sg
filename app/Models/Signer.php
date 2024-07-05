<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Signer extends Model
{

    protected $hidden = ['otp'];

    protected $fillable = ['name', 'email', 'document_id', 'mark_coordinate_path', 'mark_coordinate_filename', 'signature', 'last_sent_otp', 'otp', 'ip_address', 'location', 'type', 'mail_sent'];

    protected $appends = ['public_signature'];

    public function getCreatedAtAttribute($value)
    {
        return Carbon::parse($value)->toDateTimeString();
    }

    function getPublicSignatureAttribute()
    {
        return asset('storage/signatures/' . basename($this->signature));
    }

    public function document()
    {
        return $this->belongsTo(Document::class);
    }

    public function signatures()
    {
        return $this->hasMany(Signature::class);
    }
}
