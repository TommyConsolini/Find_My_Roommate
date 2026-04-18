<?php

/**
 * Message Model representing the 'messages' table.
 * Implements logic for UR-05 (Messaging)
 */

class Message
{
    private $conn;
    private $table_name = 'messages';

    public $id;
    public $sender_id;
    public $receiver_id;
    public $ad_id;
    public $content;
    public $created_at;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /**
     * SEND: Create a new message
     */
    public function create()
    {
        $query = 'INSERT INTO ' . $this->table_name . ' 
                  SET sender_id=:sender_id, receiver_id=:receiver_id, 
                      ad_id=:ad_id, content=:content';

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->content = htmlspecialchars(strip_tags($this->content));

        // Bind
        $stmt->bindParam(':sender_id', $this->sender_id);
        $stmt->bindParam(':receiver_id', $this->receiver_id);
        $stmt->bindParam(':ad_id', $this->ad_id);  // Can be NULL
        $stmt->bindParam(':content', $this->content);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    /**
     * READ: Get conversation between current user and another user
     * @param int $otherUserId
     */
    public function readConversation($otherUserId)
    {
        // Fetch messages where (sender=Me AND receiver=Other) OR (sender=Other AND receiver=Me)
        $query = 'SELECT m.*, u.first_name as sender_name 
                  FROM ' . $this->table_name . ' m
                  JOIN users u ON m.sender_id = u.id
                  WHERE (sender_id = :me AND receiver_id = :other)
                     OR (sender_id = :other AND receiver_id = :me)
                  ORDER BY created_at ASC';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':me', $this->sender_id);  // Current User
        $stmt->bindParam(':other', $otherUserId);

        $stmt->execute();
        return $stmt;
    }

    /**
     * INBOX: Get list of users I have chatted with
     */
    public function getInbox()
    {
        // Complex query to get unique conversation partners
        $query = 'SELECT DISTINCT 
                    CASE 
                        WHEN sender_id = :me THEN receiver_id 
                        ELSE sender_id 
                    END as contact_id
                  FROM ' . $this->table_name . '
                  WHERE sender_id = :me OR receiver_id = :me';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':me', $this->sender_id);
        $stmt->execute();
        return $stmt;
    }
}
?>
