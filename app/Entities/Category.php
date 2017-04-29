<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class Category extends Model
{
    use SoftDeletes;

    protected $fillable = ['title', 'category'];

    protected $dates = ['deleted_at'];
    public $timestamps = true;

    public function errors()
    {
        return $this->hasMany(Error::class);
    }
}
