<?php

namespace App\Entities\Contracts;

interface UserProvider
{
    const ADMIN = 'Admin';
    const CLIENT = 'CLIENT';

    public function getType();
    public function isAdmin();
    public function isClient();
    public function getName();
    public function getIdentifier();
    public function isActive();
    public function getAvatarAttribute($value);
    public function filterDocuments($documents);
}
