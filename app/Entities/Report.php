<?php
namespace App\Entities;

use Illuminate\Contracts\Logging\Log;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $table = 'reports';
    protected $fillable = [
        'lesson_id',
        'evaluator_id',
        'content',
        'criteria_1',
        'criteria_2',
        'criteria_3',
        'criteria_4',
        'criteria_5',
        'criteria_6',
        'criteria_7',
        'criteria_8',
    ];

    public function evaluator()
    {
        return $this->belongsTo(Teacher::class, 'evaluator_id');
    }
}
