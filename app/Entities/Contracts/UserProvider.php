<?php

namespace App\Entities\Contracts;

interface UserProvider
{
    const ADMIN = 'Admin';
    const TEACHER = 'Teacher';

    public function getType();
    public function isAdmin();
    public function isTeacher();
    public function getName();
    public function getIdentifier();
    public function isActive();
    public function getAvatarAttribute($value);
    public function filterDocuments($documents);
}
