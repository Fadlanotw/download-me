CREATE DATABASE IF NOT EXISTS spmb;
USE spmb;

CREATE TABLE IF NOT EXISTS jurusan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  kuota INT NOT NULL DEFAULT 36
);

CREATE TABLE IF NOT EXISTS calon_siswa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  no_pendaftaran VARCHAR(20) NOT NULL UNIQUE,
  nama VARCHAR(100) NOT NULL,
  nisn VARCHAR(20) NOT NULL,
  jenis_kelamin ENUM('L','P') NOT NULL,
  tempat_lahir VARCHAR(50),
  tanggal_lahir DATE,
  alamat TEXT,
  asal_sekolah VARCHAR(100),
  no_hp VARCHAR(20),
  jurusan_id INT NOT NULL,
  status ENUM('menunggu','diterima','ditolak') NOT NULL DEFAULT 'menunggu',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (jurusan_id) REFERENCES jurusan(id)
);

INSERT INTO jurusan (nama, kuota) VALUES
 ('Rekayasa Perangkat Lunak', 36),
 ('Teknik Komputer dan Jaringan', 36),
 ('Akuntansi', 36),
 ('Desain Komunikasi Visual', 36);
