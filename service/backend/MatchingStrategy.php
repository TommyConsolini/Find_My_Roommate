<?php
class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct() {
        // Se presenti env, usale (Docker). Altrimenti fallback ai valori che avevi tu.
        $this->host     = getenv('DB_HOST') ?: "database";
        $this->db_name  = getenv('DB_NAME') ?: "roommatedb";
        $this->username = getenv('DB_USER') ?: "user";
        $this->password = getenv('DB_PASS') ?: "userpass";
    }

    public function getConnection() {
        $this->conn = null;

        try {
            $dsn = "mysql:host={$this->host};dbname={$this->db_name};charset=utf8mb4";
            $this->conn = new PDO($dsn, $this->username, $this->password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
        } catch(PDOException $exception) {
            // Meglio restituire JSON d'errore invece di echo raw
            http_response_code(500);
            echo json_encode(["message" => "DB connection error", "detail" => $exception->getMessage()]);
            exit();
        }

        return $this->conn;
    }
}
