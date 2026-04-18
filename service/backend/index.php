<?php

/**
 * Search Controller.
 * Handles Search and Matching (UR-04).
 */

include_once __DIR__ . '/../config/Database.php';
include_once __DIR__ . '/../models/User.php';
include_once __DIR__ . '/../models/Ad.php';
include_once __DIR__ . '/../models/StandardMatching.php';
include_once __DIR__ . '/../models/StrictMatching.php';

// Initialize
$database = new Database();
$db = $database->getConnection();
$user = new User($db);
$ad = new Ad($db);

// 1. Get Current User (to know their habits)
// We need the token to know WHO is searching
$headers = getallheaders();
$token = isset($headers['Authorization']) ? $headers['Authorization'] : null;
if ($token && strpos($token, 'Bearer ') === 0) {
    $token = substr($token, 7);
}

// 2. Load User Profile
$currentUserProfile = null;
if ($token && $user->authenticateByToken($token)) {
    // We need the full profile (smoker, pets, gender) for matching
    $currentUserProfile = $user->getProfile(); 
}

// 3. Fetch All Ads
$stmt = $ad->read();
$ads_arr = array();

// 4. Instantiate the Strategy
$strategyType = isset($_GET['strategy']) ? $_GET['strategy'] : 'standard';
$matcher = null;
if ($strategyType === 'strict') {
    $matcher = new StrictMatching();
} else {
    $matcher = new StandardMatching();
}

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    
    // Default score if user is NOT logged in (show everything)
    $compatibility = null;

    if ($currentUserProfile) {
        // EXECUTE STRATEGY: Calculate score
        $compatibility = $matcher->calculateScore($currentUserProfile, $row);

        // Filter: If score is 0 (Incompatible), skip this ad
        if ($compatibility === 0) {
            continue; 
        }
    }

    // Prepare the item
    $ad_item = array(
        "id" => $row['id'],
        "title" => $row['title'],
        "price" => $row['price'],
        "city" => $row['city'],
        "description" => $row['description'],
        "score" => $compatibility // Frontend can sort by this!
    );

    array_push($ads_arr, $ad_item);
}

// 5. Sort by Score (Best Match First)
if ($currentUserProfile) {
    usort($ads_arr, function ($a, $b) {
        return $b['score'] <=> $a['score']; // Descending order
    });
}

http_response_code(200);
echo json_encode($ads_arr);
?>
