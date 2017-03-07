<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $fillable = ['title'];

    protected $dates = ['deleted_at'];
    protected $timestamps = true;

    public function errors()
    {
        $this->belongsToMany(Error::class);
    }
}
