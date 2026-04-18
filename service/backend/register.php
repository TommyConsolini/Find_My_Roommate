<?php

/**
 * Messages Controller.
 * Handles Messaging (UR-05).
 */

include_once __DIR__ . '/../config/Database.php';
include_once __DIR__ . '/../models/User.php';
include_once __DIR__ . '/../models/Message.php';

// Init
$database = new Database();
$db = $database->getConnection();
$user = new User($db);
$message = new Message($db);

// AUTHENTICATION (Required for messaging)
$headers = getallheaders();
$token = isset($headers['Authorization']) ? substr($headers['Authorization'], 7) : null;

if (!$token || !$user->authenticateByToken($token)) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized.']);
    exit();
}

// Current User is the "Sender" for POST, or "Me" for GET
$currentUserId = $user->id;
$message->sender_id = $currentUserId;

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    // --- SEND MESSAGE ---
    case 'POST':
        $data = json_decode(file_get_contents('php://input'));

        if (!empty($data->receiver_id) && !empty($data->content)) {
            $message->receiver_id = $data->receiver_id;
            $message->content = $data->content;
            $message->ad_id = $data->ad_id ?? null;  // Optional

            if ($message->create()) {
                http_response_code(201);
                echo json_encode(['message' => 'Message sent.']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Unable to send message.']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Incomplete data. Need receiver_id and content.']);
        }
        break;

    // --- READ MESSAGES ---
    case 'GET':
        // If ?contact_id=5 provided, get chat history with User 5
        if (isset($_GET['contact_id'])) {
            $otherUserId = $_GET['contact_id'];
            $stmt = $message->readConversation($otherUserId);
            $history = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($history, array(
                    'id' => $row['id'],
                    'content' => $row['content'],
                    'sender_id' => $row['sender_id'],
                    'sender_name' => $row['sender_name'],
                    'is_mine' => ($row['sender_id'] == $currentUserId),
                    'created_at' => $row['created_at']
                ));
            }
            http_response_code(200);
            echo json_encode($history);
        }
        // Otherwise, get list of contacts (Inbox)
        else {
            $stmt = $message->getInbox();
            $contacts = array();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($contacts, $row['contact_id']);
            }
            http_response_code(200);
            echo json_encode(['contacts' => $contacts]);
        }
        break;
}
?>
