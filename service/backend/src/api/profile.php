<?php

/**
 * Profile Controller.
 * Handles Profiling (UR-02).
 */

include_once __DIR__ . '/../config/Database.php';
include_once __DIR__ . '/../models/User.php';

// 2. Initialize
$database = new Database();
$db = $database->getConnection();
$user = new User($db);

// 3. SECURITY: Get Token from Header
$headers = getallheaders();
$token = isset($headers['Authorization']) ? $headers['Authorization'] : null;

// Remove "Bearer " prefix if present
if ($token && strpos($token, 'Bearer ') === 0) {
    $token = substr($token, 7);
}

// 4. Validate Token
// We use the method we created earlier to find the user by token
if (!$token || !$user->authenticateByToken($token)) {
    http_response_code(401);
    echo json_encode(["message" => "Unauthorized. Invalid or missing token."]);
    exit();
}

// 5. Handle Methods (GET vs PUT)
$method = $_SERVER['REQUEST_METHOD'];

// --- GET: Read Profile ---
if ($method === 'GET') {
    $data = $user->getProfile();
    if ($data) {
        http_response_code(200);
        echo json_encode($data);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Profile not found."]);
    }
}

// --- PUT: Update Profile ---
elseif ($method === 'PUT') {
    // Read JSON input
    $input = json_decode(file_get_contents("php://input"));

    // Map input to User object properties
    // We use ternary operators to keep existing values if not provided (optional)
    $user->gender = $input->gender ?? 'Other';
    $user->bio = $input->bio ?? '';
    $user->birth_date = $input->birth_date ?? null;
    $user->is_smoker = isset($input->is_smoker) ? (int)$input->is_smoker : 0;
    $user->has_pets = isset($input->has_pets) ? (int)$input->has_pets : 0;

    if ($user->updateProfile()) {
        http_response_code(200);
        echo json_encode(["message" => "Profile updated successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Unable to update profile."]);
    }
}

else {
    http_response_code(405);
    echo json_encode(["message" => "Method Not Allowed."]);
}
?>
