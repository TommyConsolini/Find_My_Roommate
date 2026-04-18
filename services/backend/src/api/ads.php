<?php

/**
 * Ads Controller.
 * Handles Ads (UR-03).
 */
include_once __DIR__ . '/../config/Database.php';
include_once __DIR__ . '/../models/User.php';
include_once __DIR__ . '/../models/Ad.php';

// Initialize
$database = new Database();
$db = $database->getConnection();
$user = new User($db);
$ad = new Ad($db);

// 1. AUTHENTICATION HELPER
$headers = getallheaders();
$token = isset($headers['Authorization']) ? $headers['Authorization'] : null;
if ($token && strpos($token, 'Bearer ') === 0) {
    $token = substr($token, 7);
}

// Try to authenticate. If successful, $user->id is set.
$is_authenticated = false;
if ($token && $user->authenticateByToken($token)) {
    $is_authenticated = true;
    $ad->user_id = $user->id;  // Set the owner for the Ad model
}

// 2. ROUTING BY METHOD
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? $_GET['id'] : null;

switch ($method) {
    // --- READ (Public) ---
    case 'GET':
        if ($id) {
            $ad->id = $id;
            if ($ad->readSingle()) {
                // Add owner_id to response so frontend knows if they can edit it
                $ad_arr = array(
                    'id' => $ad->id,
                    'title' => $ad->title,
                    'description' => $ad->description,
                    'price' => $ad->price,
                    'city' => $ad->city,
                    'is_owner' => ($is_authenticated && $user->id == $ad->user_id)
                );
                http_response_code(200);
                echo json_encode($ad_arr);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Ad not found.']);
            }
        } else {
            // Read All
            $stmt = $ad->read();
            $ads_arr = array();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($ads_arr, $row);
            }
            http_response_code(200);
            echo json_encode($ads_arr);
        }
        break;

    // --- CREATE (Auth Required) ---
    case 'POST':
        if (!$is_authenticated) {
            http_response_code(401);
            echo json_encode(['message' => 'Unauthorized.']);
            break;
        }

        $data = json_decode(file_get_contents('php://input'));

        if (!empty($data->title) && !empty($data->price) && !empty($data->city)) {
            $ad->title = $data->title;
            $ad->description = $data->description ?? '';
            $ad->price = $data->price;
            $ad->city = $data->city;
            $ad->address = $data->address ?? '';
            $ad->smoking_allowed = $data->smoking_allowed ?? 0;
            $ad->pets_allowed = $data->pets_allowed ?? 0;
            $ad->gender_preference = $data->gender_preference ?? 'Any';

            if ($ad->create()) {
                http_response_code(201);
                echo json_encode(['message' => 'Ad created successfully.']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Unable to create ad.']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Incomplete data.']);
        }
        break;

    // --- UPDATE (Auth + Ownership Required) ---
    case 'PUT':
        if (!$is_authenticated) {
            http_response_code(401);
            echo json_encode(['message' => 'Unauthorized.']);
            break;
        }

        $data = json_decode(file_get_contents('php://input'));
        $ad->id = $data->id;  // ID must be in the JSON body
        $ad->title = $data->title;
        $ad->description = $data->description;
        $ad->price = $data->price;
        $ad->city = $data->city;
        $ad->smoking_allowed = $data->smoking_allowed ?? 0;
        $ad->pets_allowed = $data->pets_allowed ?? 0;
        $ad->gender_preference = $data->gender_preference ?? 'Any';

        if ($ad->update()) {
            http_response_code(200);
            echo json_encode(['message' => 'Ad updated.']);
        } else {
            http_response_code(403);  // Forbidden (likely not the owner)
            echo json_encode(['message' => 'Update failed. You might not be the owner.']);
        }
        break;

    // --- DELETE (Auth + Ownership Required) ---
    case 'DELETE':
        if (!$is_authenticated) {
            http_response_code(401);
            echo json_encode(['message' => 'Unauthorized.']);
            break;
        }

        // We accept ID via URL parameter (api/ads?id=1) OR JSON body
        // 1. Search the ID in the URL (high priority: DELETE /api/ads?id=1)
        if (isset($_GET['id'])) {
            $ad->id = $_GET['id'];
        } 
        // 2. Elsewhere, search it in the JSON body
        else {
            $data = json_decode(file_get_contents("php://input"));
            if (isset($data->id)) {
                $ad->id = $data->id;
            } else {
                http_response_code(400);
                echo json_encode(["message" => "Missing ID. Please provide ?id= in URL or JSON body."]);
                break;
            }
        }

        if ($ad->delete()) {
            http_response_code(200);
            echo json_encode(['message' => 'Ad deleted.']);
        } else {
            http_response_code(403);
            echo json_encode(['message' => 'Delete failed. You might not be the owner.']);
        }
        break;
}
?>
