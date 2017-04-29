<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Error extends Model
{
    use SoftDeletes;

    protected $fillable = ['error', 'solution', 'reason', 'category_id'];
    protected $dates = ['deleted_at'];
    public $timestamps = true;

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'post_tags', 'tag_id', 'post_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
