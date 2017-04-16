<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Model;
use App\Entities\Admin;
use App\Entities\Teacher;

class Comment extends Model
{
    protected $table = 'comments';
    protected $fillable = [
        'class_id',
        'userable_id',
        'userable_type',
        'content',
    ];

    public function userable()
    {
        return $this->morphTo();
    }
}
