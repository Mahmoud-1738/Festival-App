<?php
// GET /api/schedule.php — public; returns the whole line-up.
require __DIR__ . '/db.php';
cors();

$pdo = db();
$stages = $pdo->query('SELECT `idx`, `name`, `sub` FROM `stages` ORDER BY `idx`')->fetchAll();

$rows = $pdo->query(
  'SELECT `id`, `day_num`, `s`, `k`, `name`, `start_time` AS `start`, `end_time` AS `end`, `genre`, `bio`
   FROM `acts` ORDER BY `day_num`, `s`, `start_time`'
)->fetchAll();

$schedule = ['1' => [], '2' => []];
foreach ($rows as $r) {
  $day = (string)$r['day_num'];
  if (!isset($schedule[$day])) $schedule[$day] = [];
  $act = [
    'id'    => $r['id'],
    's'     => (int)$r['s'],
    'k'     => $r['k'],
    'name'  => $r['name'],
    'start' => $r['start'],
    'end'   => $r['end'],
  ];
  if ($r['genre'] !== null && $r['genre'] !== '') $act['genre'] = $r['genre'];
  if ($r['bio']   !== null && $r['bio']   !== '') $act['bio']   = $r['bio'];
  $schedule[$day][] = $act;
}

// `stages` returned with int idx coerced for cleanliness
$stages = array_map(fn($s) => ['name' => $s['name'], 'sub' => $s['sub']], $stages);

send(['stages' => $stages, 'schedule' => $schedule, 'artists' => (object)[]]);
