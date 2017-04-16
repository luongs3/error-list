<?php
/**
 * Created by PhpStorm.
 * User: FRAMGIA\nguyen.huu.kim
 * Date: 09/01/2017
 * Time: 09:49
 */

namespace App\Entities;

use Illuminate\Database\Eloquent\Model;

class CourseTeacher extends Model
{
    protected $table = 'course_teachers';

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
