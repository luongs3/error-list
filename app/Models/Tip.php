<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tip extends Model
{
    protected $fillable = ['title', 'content', 'project_id', 'category_id'];

    protected $dates = ['deleted_at'];
    protected $timestamps = true;

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'post_tags', 'tag_id', 'post_id');
    }
}
