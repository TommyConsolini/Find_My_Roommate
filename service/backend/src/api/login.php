<?php

/**
 * Login Controller.
 * Handles Authentication (UR-01).
 */

include_once __DIR__ . '/../config/Database.php';
include_once __DIR__ . '/../models/User.php';

// SECURITY CHECK: Enforce POST method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    
    // Add header to tell the client which method IS allowed
    header("Allow: POST"); 
    
    echo json_encode(["message" => "Method Not Allowed. Only POST is accepted for login."]);
    return;
}

// 1. Initialize Database
$database = new Database();
$db = $database->getConnection();

if ($db === null) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed."]);
    return;
}

$user = new User($db);
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->password)) {

    $user->email = $data->email;
    $email_exists = $user->emailExists();

    // Verify Password
    if($email_exists && password_verify($data->password, $user->password)) {
        
        $token = $user->generateToken();

        if($token) {
            http_response_code(200);
            echo json_encode(array(
                "message" => "Login successful.",
                "token" => $token, // THE FRONTEND MUST SAVE THIS (e.g., localStorage)
                "user" => array(
                    "id" => $user->id,
                    "first_name" => $user->first_name,
                    "email" => $user->email
                )
            ));
        } else {
            http_response_code(500);
            echo json_encode(array("message" => "Login failed. Could not generate session token."));
        }
    } 
    else {
        http_response_code(401);
        echo json_encode(array("message" => "Login failed. Invalid credentials."));
    }
} 
else {
    http_response_code(400);
    echo json_encode(array("message" => "Incomplete data. Email and Password are required."));
}
?>
