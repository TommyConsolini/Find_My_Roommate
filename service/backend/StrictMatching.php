<?php

/**
 * Ad Model representing the 'ads' table.
 * Implements logic for UR-03 (Ad Management)
 */

class Ad {
    private $conn;
    private $table_name = "ads";

    public $id;
    public $user_id;
    public $title;
    public $description;
    public $price;
    public $city;
    public $address;
    public $smoking_allowed;
    public $pets_allowed;
    public $gender_preference;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * READ: Get all ads (Public)
     * Useful for the homepage or search list.
     */
    public function read() {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    /**
     * READ SINGLE: Get one ad by ID (Public)
     */
    public function readSingle() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if($row) {
            $this->title = $row['title'];
            $this->description = $row['description'];
            $this->price = $row['price'];
            $this->city = $row['city'];
            $this->user_id = $row['user_id'];
            return true;
        }
        return false;
    }

    /**
     * CREATE: Post a new ad (Authenticated)
     */
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET user_id=:user_id, title=:title, description=:description, 
                      price=:price, city=:city, address=:address, 
                      smoking_allowed=:smoking, pets_allowed=:pets, gender_preference=:gender";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->city = htmlspecialchars(strip_tags($this->city));
        
        // Bind
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":city", $this->city);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":smoking", $this->smoking_allowed, PDO::PARAM_INT);
        $stmt->bindParam(":pets", $this->pets_allowed, PDO::PARAM_INT);
        $stmt->bindParam(":gender", $this->gender_preference);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    /**
     * UPDATE: Modify an ad (Owner Only)
     * We check `user_id` in the WHERE clause for security.
     */
    public function update() {
        $query = "UPDATE " . $this->table_name . "
                  SET title = :title, description = :description, price = :price, 
                      city = :city, smoking_allowed = :smoking, 
                      pets_allowed = :pets, gender_preference = :gender
                  WHERE id = :id AND user_id = :user_id"; // SECURITY CHECK HERE

        $stmt = $this->conn->prepare($query);

        // Bind
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":city", $this->city);
        $stmt->bindParam(":smoking", $this->smoking_allowed, PDO::PARAM_INT);
        $stmt->bindParam(":pets", $this->pets_allowed, PDO::PARAM_INT);
        $stmt->bindParam(":gender", $this->gender_preference);
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":user_id", $this->user_id);

        if($stmt->execute()) {
            // Check if any row was actually updated (if 0, implies ID not found OR not owner)
            return $stmt->rowCount() > 0; 
        }
        return false;
    }

    /**
     * DELETE: Remove an ad (Owner Only)
     */
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id AND user_id = :user_id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":user_id", $this->user_id);

        if($stmt->execute()) {
            return $stmt->rowCount() > 0;
        }
        return false;
    }
}
?>
