<?php
// /api/acts.php — admin CRUD for acts (requires Bearer token)
//   POST                 -> create  (body: day, s, k, name, start, end, genre?, bio?)
//   PUT    ?id=<id>       -> update  (same fields; day optional = move day)
//   DELETE ?id=<id>       -> delete
require __DIR__ . '/db.php';
cors();
require_auth();

$pdo = db();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$id = $_GET['id'] ?? null;

$VALID_KINDS = ['main', 'talent', 'club', 'dj'];

// Validate + normalise an incoming act. $existing fills gaps on update.
function clean_act($in, $pdo, $VALID_KINDS, $existing = null) {
  $src = $existing ? array_merge($existing, $in) : $in;
  $errors = [];

  $stageCount = (int)$pdo->query('SELECT COUNT(*) FROM `stages`')->fetchColumn();
  $s = filter_var($src['s'] ?? null, FILTER_VALIDATE_INT);
  if ($s === false || $s === null || $s < 0 || $s >= $stageCount) $errors[] = 'invalid stage (s)';

  $k = $src['k'] ?? '';
  if (!in_array($k, $VALID_KINDS, true)) $errors[] = 'invalid kind (k)';

  $name = trim((string)($src['name'] ?? ''));
  if ($name === '') $errors[] = 'name is required';

  $start = $src['start'] ?? '';
  $end   = $src['end'] ?? '';
  if (!preg_match('/^\d{1,2}:\d{2}$/', $start)) $errors[] = 'start must be HH:MM';
  if (!preg_match('/^\d{1,2}:\d{2}$/', $end))   $errors[] = 'end must be HH:MM';

  $day = filter_var($src['day'] ?? ($src['day_num'] ?? 1), FILTER_VALIDATE_INT);
  if ($day !== 1 && $day !== 2) $errors[] = 'invalid day';

  $genre = isset($src['genre']) ? trim((string)$src['genre']) : null;
  $bio   = isset($src['bio'])   ? trim((string)$src['bio'])   : null;

  return [[
    's' => (int)$s, 'k' => $k, 'name' => $name,
    'start' => $start, 'end' => $end, 'day' => (int)$day,
    'genre' => ($genre === '' ? null : $genre),
    'bio'   => ($bio === '' ? null : $bio),
  ], $errors];
}

if ($method === 'POST') {
  [$a, $errors] = clean_act(body(), $pdo, $VALID_KINDS);
  if ($errors) fail(implode(', ', $errors));
  $newId = 'a_' . bin2hex(random_bytes(5));
  $stmt = $pdo->prepare(
    'INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`,`genre`,`bio`)
     VALUES (?,?,?,?,?,?,?,?,?)'
  );
  $stmt->execute([$newId, $a['day'], $a['s'], $a['k'], $a['name'], $a['start'], $a['end'], $a['genre'], $a['bio']]);
  send(array_merge(['id' => $newId], $a), 201);
}

if ($method === 'PUT') {
  if (!$id) fail('missing id');
  $row = $pdo->prepare('SELECT `day_num` AS `day`, `s`, `k`, `name`, `start_time` AS `start`, `end_time` AS `end`, `genre`, `bio` FROM `acts` WHERE `id` = ?');
  $row->execute([$id]);
  $existing = $row->fetch();
  if (!$existing) fail('act not found', 404);

  [$a, $errors] = clean_act(body(), $pdo, $VALID_KINDS, $existing);
  if ($errors) fail(implode(', ', $errors));
  $stmt = $pdo->prepare(
    'UPDATE `acts` SET `day_num`=?, `s`=?, `k`=?, `name`=?, `start_time`=?, `end_time`=?, `genre`=?, `bio`=? WHERE `id`=?'
  );
  $stmt->execute([$a['day'], $a['s'], $a['k'], $a['name'], $a['start'], $a['end'], $a['genre'], $a['bio'], $id]);
  send(array_merge(['id' => $id], $a));
}

if ($method === 'DELETE') {
  if (!$id) fail('missing id');
  $stmt = $pdo->prepare('DELETE FROM `acts` WHERE `id` = ?');
  $stmt->execute([$id]);
  if ($stmt->rowCount() === 0) fail('act not found', 404);
  send(['ok' => true]);
}

fail('Method not allowed', 405);
