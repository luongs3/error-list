<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use SoftDeletes;

    protected $fillable = ['title', 'description', 'started_at', 'ended_at'];

    protected $dates = ['deleted_at', 'started_at', 'ended_at'];
    public $timestamps = true;

    public function errors()
    {
        return $this->hasMany(Error::class);
    }

    public function tips()
    {
        return $this->hasMany(Tip::class);
    }
}
