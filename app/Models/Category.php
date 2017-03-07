<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use SoftDeletes;

    protected $fillable = ['title', 'category'];

    protected $dates = ['deleted_at'];
    protected $timestamps = true;

    public function errors()
    {
        return $this->hasMany(Error::class);
    }
}
