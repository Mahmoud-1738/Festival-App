<?php
// POST /api/login.php — { password } -> { token }
require __DIR__ . '/db.php';
cors();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') fail('Use POST', 405);

$pw = body()['password'] ?? '';
if (!hash_equals(ADMIN_PASSWORD, (string)$pw)) fail('Wrong password', 401);

send(['token' => make_token()]);
