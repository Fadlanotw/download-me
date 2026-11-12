-- ============================================
-- Database: login_app
-- Untuk fitur Login (email/password + social login)
-- Jalankan file ini di HeidiSQL / phpMyAdmin (Laragon)
-- ============================================

CREATE DATABASE IF NOT EXISTS login_app
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE login_app;
  
-- ============================================
-- Tabel users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NULL,              -- NULL jika user hanya login lewat Google/Facebook
  avatar VARCHAR(255) NULL,
  provider ENUM('local', 'google', 'facebook') NOT NULL DEFAULT 'local',
  provider_id VARCHAR(255) NULL,           -- ID dari Google/Facebook jika pakai social login
  is_verified TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- Tabel sessions (opsional, untuk menyimpan token login/JWT/refresh token)
-- ============================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- Contoh data (opsional, hapus jika tidak perlu)
-- Password contoh di bawah adalah hash bcrypt dari: "password123"
-- ============================================
INSERT INTO users (name, email, password, provider)
VALUES
  ('Test User', 'test@example.com', '$2y$10$examplehashdontuseinproduction', 'local');
