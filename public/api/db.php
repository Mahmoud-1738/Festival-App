<?php
// ============================================================
// ❤U Festival — shared PHP API helpers (DB, auth, JSON)
// Edit the CONFIG block to match your MySQL / hosting settings.
// ============================================================

// ---- CONFIG -------------------------------------------------
// gluwebsite.nl (DirectAdmin / MariaDB) database credentials.
const DB_HOST = 'localhost';
const DB_NAME = 'u240407_festival';
const DB_USER = 'u240407_festival';
const DB_PASS = 'zZDMAhVaa8d4zHMWS5uJ';

const ADMIN_PASSWORD = 'festival2026';
// Random string used to sign admin login tokens.
const TOKEN_SECRET = 'd215932be36bb72a65172b3dbe974fe2054a4ac52ef43cd3';
const TOKEN_TTL = 60 * 60 * 8; // tokens valid for 8 hours

// ---- Response helpers --------------------------------------
function cors() {
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Headers: Content-Type, Authorization');
  header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
  if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }
}

function send($data, $code = 200) {
  http_response_code($code);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

function fail($msg, $code = 400) { send(['error' => $msg], $code); }

function body() {
  $raw = file_get_contents('php://input');
  $j = json_decode($raw, true);
  return is_array($j) ? $j : [];
}

// ---- Database ----------------------------------------------
function db() {
  static $pdo = null;
  if ($pdo === null) {
    try {
      $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER, DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
      );
    } catch (PDOException $e) {
      fail('Database connection failed. Check db.php settings and that MySQL is running.', 500);
    }
  }
  return $pdo;
}

// ---- Auth (stateless signed token, no extra table needed) ---
function make_token() {
  $exp = time() + TOKEN_TTL;
  $sig = hash_hmac('sha256', (string)$exp, TOKEN_SECRET);
  return base64_encode($exp . '.' . $sig);
}

function valid_token($token) {
  $raw = base64_decode($token, true);
  if (!$raw || strpos($raw, '.') === false) return false;
  [$exp, $sig] = explode('.', $raw, 2);
  if (!ctype_digit($exp) || (int)$exp < time()) return false;
  return hash_equals(hash_hmac('sha256', $exp, TOKEN_SECRET), $sig);
}

function require_auth() {
  $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
  $token = (stripos($hdr, 'Bearer ') === 0) ? substr($hdr, 7) : '';
  if (!$token || !valid_token($token)) fail('Unauthorized', 401);
}
