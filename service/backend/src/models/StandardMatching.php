<?php
require_once __DIR__ . '/MatchingStrategy.php';

class StandardMatching implements MatchingStrategy {
    
    public function calculateScore(array $user, array $ad): int {
        $score = 100; // Start with perfect score

        // 1. Smoking Rule
        // If user smokes (1) but ad says NO smoking (0)
        if (!empty($user['is_smoker']) && empty($ad['smoking_allowed'])) {
            $score -= 80;
        }
        // If user smokes and ad allows it, no penalty.
        // If user doesn't smoke, it doesn't matter.

        // 2. Pets Rule
        // If user has pets (1) but ad says NO pets (0)
        if (!empty($user['has_pets']) && empty($ad['pets_allowed'])) {
            $score -= 50;
        }

        // 3. Gender Preference
        // If ad prefers 'M' but user is 'F' (or vice versa)
        if ($ad['gender_preference'] !== 'Any' && $ad['gender_preference'] !== $user['gender']) {
            $score -= 30;
        }

        return max(0, $score);
    }
}
?>
