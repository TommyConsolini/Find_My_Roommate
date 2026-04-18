<?php

/**
 * Register Controller.
 * Handles Registration (UR-01).
 */

// Needed files inclusion
include_once __DIR__ . '/../config/Database.php';
include_once __DIR__ . '/../models/User.php';

// SECURITY CHECK: Enforce POST method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    
    // Add header to tell the client which method IS allowed
    header("Allow: POST"); 
    
    echo json_encode(["message" => "Method Not Allowed. Only POST is accepted for register."]);
    return;
}

// DB connection
$database = new Database();
$db = $database->getConnection();

if ($db === null) {
    http_response_code(500);
    echo json_encode(array('message' => 'Database connection failed.'));
    return;
}

// User instance
$user = new User($db);

// Get raw JSON data from the POST request
$data = json_decode(file_get_contents('php://input'));

// Input validation: check that fields aren't empty
if (
    !empty($data->first_name) &&
    !empty($data->last_name) &&
    !empty($data->email) &&
    !empty($data->password)
) {
    // Assign values to Model
    $user->first_name = $data->first_name;
    $user->last_name = $data->last_name;
    $user->email = $data->email;
    $user->password = $data->password;

    // Creation attempt
    try {
        if ($user->create()) {
            // 201 Created
            http_response_code(201);
            echo json_encode(array('message' => 'User registered successfully.'));
        } else {
            // 503 Service Unavailable (DB generic error)
            http_response_code(503);
            echo json_encode(array('message' => 'Unable to register user.'));
        }
    } catch (PDOException $e) {
        // Duplicate entry error handling (email already used)
        http_response_code(400);
        echo json_encode(array('message' => 'Email already exists or database error.'));
    }
} else {
    // 400 Bad Request - Incomplete data
    http_response_code(400);
    echo json_encode(array('message' => 'Incomplete data. Please complete all fields.'));
}
?>
