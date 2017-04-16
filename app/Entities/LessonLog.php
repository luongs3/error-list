<?php
namespace App\Entities;

use Illuminate\Database\Eloquent\Model;

class LessonLog extends Model
{
    protected $table = 'lesson_logs';
    protected $fillable = ['lesson_id', 'message'];
}
