<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Error extends Model
{
    protected $fillable = ['error', 'solution', 'reason', 'category_id'];

    protected $dates = ['deleted_at'];
    protected $timestamps = true;

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
}
