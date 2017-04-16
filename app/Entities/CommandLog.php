<?php
namespace App\Entities;

use Illuminate\Database\Eloquent\Model;

class CommandLog extends Model
{
    protected $fillable = ['date', 'time', 'command', 'status'];
    protected $casts = ['status' => 'boolean'];
}
