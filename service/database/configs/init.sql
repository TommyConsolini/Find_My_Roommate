-- Creazione del database (allineato a backend/src/models)
CREATE DATABASE IF NOT EXISTS find_my_roommate;
USE find_my_roommate;

-- 1) Utenti
-- Il backend si aspetta: first_name, last_name, email, password, api_token
-- e campi profilo: gender, bio, birth_date, is_smoker, has_pets
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name  VARCHAR(100) NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    password   VARCHAR(255) NOT NULL,
    api_token  VARCHAR(128) DEFAULT NULL,

    gender     VARCHAR(30) DEFAULT NULL,
    bio        TEXT DEFAULT NULL,
    birth_date DATE DEFAULT NULL,
    is_smoker  TINYINT(1) NOT NULL DEFAULT 0,
    has_pets   TINYINT(1) NOT NULL DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2) Annunci
-- Allineato a backend/src/models/Ad.php
CREATE TABLE IF NOT EXISTS ads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    price DECIMAL(10, 2) NOT NULL,
    city VARCHAR(120) NOT NULL,
    address VARCHAR(255) DEFAULT NULL,
    smoking_allowed TINYINT(1) NOT NULL DEFAULT 0,
    pets_allowed TINYINT(1) NOT NULL DEFAULT 0,
    gender_preference VARCHAR(30) DEFAULT 'Any',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3) Messaggi
-- Allineato a backend/src/models/Message.php
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    ad_id INT DEFAULT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Persistenza timestamp
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE SET NULL
) ENGINE=InnoDB;
