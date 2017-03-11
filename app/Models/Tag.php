<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $fillable = ['title'];

    protected $dates = ['deleted_at'];
    public $timestamps = true;

    public function errors()
    {
        $this->belongsToMany(Error::class);
    }

    public function setTitleAttribute($value)
    {
        $value = strtolower($value);
        $this->attributes['title'] = ucfirst($value);
    }
}
