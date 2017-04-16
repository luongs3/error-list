<?php
namespace App\Entities;

use Carbon\Carbon;
use Illuminate\Contracts\Logging\Log;
use Illuminate\Database\Eloquent\Model;

class MonthlyReport extends Model
{
    protected $table = 'monthly_reports';
    protected $fillable = [
        'teacher_id',
        'date',
        'university_id',
        'lesson_ids',
        'grades',
        'total',
        'official',
        'non_official',
    ];

    protected $casts = [
        'lesson_ids' => 'array',
        'grades' => 'array',
        'total' => 'array',
        'official' => 'array',
        'non_official' => 'array',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function scopePresentMonth($query)
    {
        return $query->whereBetween('date', [Carbon::now()->startOfMonth(), Carbon::now()]);
    }

    public function scopeInMonth($query, $month)
    {
        return $query->whereBetween('date', [$month->startOfMonth(), $month]);
    }
}
