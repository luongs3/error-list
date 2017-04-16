<?php

namespace App\Entities;

use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    public $timestamps = true;
    protected $fillable = [
        'teacher_id',
        'comment',
        'month',
        'knowledge',
        'standard_of_work',
        'autonomy',
        'coping_with_complexity',
        'perception_of_context',
        'hou_ren_sou',
        'lesson_report',
        'team_work',
        'management',
        'avg',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
}
