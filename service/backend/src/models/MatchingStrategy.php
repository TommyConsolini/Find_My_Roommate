<?php
interface MatchingStrategy {
    /**
     * Calculate the compatibility score between a user and an ad.
     * @param array $userProfile (The user seeking a room)
     * @param array $adDetails (The room being offered)
     * @return int Score from 0 to 100
     */
    public function calculateScore(array $userProfile, array $adDetails): int;
}
?>
