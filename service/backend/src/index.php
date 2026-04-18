<?php
/**
 * Front Controller (Router) - robust
 */

// CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Read path
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$pathOnly   = parse_url($requestUri, PHP_URL_PATH);
$pathOnly   = is_string($pathOnly) ? $pathOnly : '/';
$path       = trim($pathOnly, '/');

// Some servers/proxies may yield empty path
if ($path === '') {
    $pathInfo = $_SERVER['PATH_INFO'] ?? '';
    if (is_string($pathInfo) && $pathInfo !== '') {
        $path = trim($pathInfo, '/');
    }
}

/**
 * Normalize:
 * - allow both "/api/login" and "/login"
 * - remove repeated "api/" prefixes: "api/api/login" -> "login"
 */
$path = preg_replace('#^(api/)+#', '', $path);   // now "login", "register", ...
// also allow paths like "index.php/api/login"
$path = preg_replace('#^index\.php/#', '', $path);
$path = trim($path, '/');

// Routing on normalized path
switch ($path) {
    case 'register':
        require __DIR__ . '/api/register.php';
        break;

    case 'login':
        require __DIR__ . '/api/login.php';
        break;

    case 'profile':
        require __DIR__ . '/api/profile.php';
        break;

    case 'ads':
        require __DIR__ . '/api/ads.php';
        break;

    case 'search':
        require __DIR__ . '/api/search.php';
        break;

    case 'messages':
        require __DIR__ . '/api/messages.php';
        break;

    default:
        http_response_code(404);
        echo json_encode([
            "message" => "Endpoint not found: " . $path,
            "debug"   => [
                "REQUEST_URI" => $_SERVER['REQUEST_URI'] ?? null,
                "PATH_INFO"   => $_SERVER['PATH_INFO'] ?? null
            ],
            "hint" => "Valid endpoints: /api/login, /api/register, /api/ads, /api/search, /api/messages, /api/profile"
        ]);
        break;
}
