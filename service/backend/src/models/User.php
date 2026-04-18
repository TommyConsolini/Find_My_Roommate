<?php

/**
 * User Model representing the 'users' table.
 * Implements logic for UR-01 (Registration & Authentication)
 * and UR-02 (Profiling).
 */
class User
{
    private $conn;
    private $table_name = 'users';

    public $id;
    public $first_name;
    public $last_name;
    public $email;
    public $password;
    public $gender;
    public $birth_date;
    public $bio;
    public $is_smoker;
    public $has_pets;
    public $api_token;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /**
     * Create a new user record.
     * Uses Prepared Statements for security
     */
    public function create()
    {
        $query = 'INSERT INTO ' . $this->table_name . ' 
                  SET first_name=:first_name, last_name=:last_name, email=:email, password=:password';

        $stmt = $this->conn->prepare($query);

        // Sanitize inputs to prevent common code defects
        $this->first_name = htmlspecialchars(strip_tags($this->first_name));
        $this->last_name = htmlspecialchars(strip_tags($this->last_name));
        $this->email = htmlspecialchars(strip_tags($this->email));

        // Hash password before storage
        $password_hash = password_hash($this->password, PASSWORD_BCRYPT);

        $stmt->bindParam(':first_name', $this->first_name);
        $stmt->bindParam(':last_name', $this->last_name);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':password', $password_hash);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    /**
     * Check if a user exists by email.
     * Used for Login and duplicate checks.
     * * @return bool True if email exists, False otherwise.
     */
    public function emailExists()
    {
        // Query to select necessary fields for login session and verification
        $query = 'SELECT id, first_name, last_name, password  
                  FROM ' . $this->table_name . ' 
                  WHERE email = ? 
                  LIMIT 0,1';

        // Prepare the statement
        $stmt = $this->conn->prepare($query);

        // Sanitize and bind the email
        $this->email = htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(1, $this->email);

        // Execute query
        $stmt->execute();

        // If we find a row, we assign values to the object properties
        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            $this->id = $row['id'];
            $this->first_name = $row['first_name'];
            $this->last_name = $row['last_name'];
            $this->password = $row['password'];  // This is the HASHED password from DB

            // Hydrate preferences for immediate use in frontend if needed
            // (e.g., for matching logic later)
            // $this->is_smoker = $row['is_smoker'];

            return true;
        }

        return false;
    }

    /**
     * Updates the user's API token after a successful password verification.
     * This implements a basic "Stateful Token" mechanism.
     * * @return string|bool The generated token or false on failure.
     */
    public function generateToken() {
        // Generate a random 32-byte string and convert to hex (64 chars)
        $this->api_token = bin2hex(random_bytes(32));

        // Update the token in the database for this user
        $query = "UPDATE " . $this->table_name . " 
                  SET api_token = :api_token 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Sanitize (not strictly necessary for generated hash, but good practice)
        $this->api_token = htmlspecialchars(strip_tags($this->api_token));
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(':api_token', $this->api_token);
        $stmt->bindParam(':id', $this->id);

        if($stmt->execute()) {
            return $this->api_token;
        }

        return false;
    }

    /**
     * Authenticate a user by Token (Used for other APIs like Create Ad).
     * @param string $token
     * @return bool
     */
    public function authenticateByToken($token) {
        $query = "SELECT id, first_name, last_name, email 
                  FROM " . $this->table_name . " 
                  WHERE api_token = :token 
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->first_name = $row['first_name'];
            $this->last_name = $row['last_name'];
            $this->email = $row['email'];
            return true;
        }
        return false;
    }

    /**
     * Get user profile data by ID.
     * Used for the GET /profile endpoint.
     */
    public function getProfile() {
        $query = "SELECT first_name, last_name, email, gender, bio, birth_date, is_smoker, has_pets 
                  FROM " . $this->table_name . " 
                  WHERE id = ? 
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Update user profile fields.
     * Used for the PUT /profile endpoint.
     */
    public function updateProfile() {
        // Dynamic update query
        $query = "UPDATE " . $this->table_name . "
                  SET 
                    gender = :gender,
                    bio = :bio,
                    birth_date = :birth_date,
                    is_smoker = :is_smoker,
                    has_pets = :has_pets
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->gender = htmlspecialchars(strip_tags($this->gender));
        $this->bio = htmlspecialchars(strip_tags($this->bio));
        $this->birth_date = htmlspecialchars(strip_tags($this->birth_date));
        
        // Bind parameters
        $stmt->bindParam(':gender', $this->gender);
        $stmt->bindParam(':bio', $this->bio);
        $stmt->bindParam(':birth_date', $this->birth_date);
        
        // Booleans need specific handling in PDO to avoid issues
        $stmt->bindParam(':is_smoker', $this->is_smoker, PDO::PARAM_INT);
        $stmt->bindParam(':has_pets', $this->has_pets, PDO::PARAM_INT);
        
        $stmt->bindParam(':id', $this->id);

        return $stmt->execute();
    }
}
