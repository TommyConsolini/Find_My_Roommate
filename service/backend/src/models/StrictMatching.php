<?php
require_once __DIR__ . '/MatchingStrategy.php';

class StrictMatching implements MatchingStrategy {
    
    public function calculateScore(array $user, array $ad): int {
        // 1. Smoking Rule (Hard Constraint)
        if (!empty($user['is_smoker']) && empty($ad['smoking_allowed'])) {
            return 0; // Immediate FAIL
        }

        // 2. Pets Rule (Hard Constraint)
        if (!empty($user['has_pets']) && empty($ad['pets_allowed'])) {
            return 0; // Immediate FAIL
        }

        // 3. Gender Preference (Hard Constraint)
        if ($ad['gender_preference'] !== 'Any' && $ad['gender_preference'] !== $user['gender']) {
            return 0; // Immediate FAIL
        }

        // If we survived all checks, it's a perfect match
        return 100;
    }
}
?>
