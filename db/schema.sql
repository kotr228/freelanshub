-- FreelansHub schema (MySQL 8 / MariaDB 10.6+)
-- Fresh install:  npm run db:init   (or: mysql -u USER -p DB_NAME < db/schema.sql)
-- Existing PHP-era database: run db/migrate-from-php.sql instead.
--
-- Table and column names are kept from the original PHP project so existing
-- data keeps working.

CREATE TABLE IF NOT EXISTS `freelanser_akks` (
  `id_f` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password` VARCHAR(450) NOT NULL,
  `telegram` VARCHAR(45) NOT NULL,
  `phone` VARCHAR(45) NOT NULL,
  `spacialty` VARCHAR(150) NOT NULL,
  `avatar` VARCHAR(255) NULL,
  `about` TEXT NULL,
  PRIMARY KEY (`id_f`),
  UNIQUE KEY `freelanser_email_uq` (`email`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `cliants_akks` (
  `id_c` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password` VARCHAR(450) NOT NULL,
  `telegram` VARCHAR(45) NOT NULL,
  `phone` VARCHAR(45) NOT NULL,
  `rating` FLOAT NULL,
  `avatar` VARCHAR(255) NULL,
  `about` TEXT NULL,
  PRIMARY KEY (`id_c`),
  UNIQUE KEY `cliant_email_uq` (`email`)
) ENGINE = InnoDB;

-- status: S1 = active (free when id_f IS NULL, in progress otherwise),
--         S2 = done, awaiting payment, S3 = paid, S4 = archived
CREATE TABLE IF NOT EXISTS `job` (
  `id_j` INT NOT NULL AUTO_INCREMENT,
  `lable` VARCHAR(45) NOT NULL,
  `spacsalyty` VARCHAR(150) NOT NULL,
  `tipe` VARCHAR(45) NOT NULL,
  `description` VARCHAR(500) NOT NULL,
  `id_f` INT NULL,
  `id_c` INT NOT NULL,
  `status` VARCHAR(45) NOT NULL,
  `price` DECIMAL(20,2) NOT NULL,
  `date` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_j`),
  INDEX `freelanser_akks_idx` (`id_f`),
  INDEX `cliants_akks_idx` (`id_c`),
  INDEX `job_status_idx` (`status`),
  CONSTRAINT `freelanser_akks` FOREIGN KEY (`id_f`) REFERENCES `freelanser_akks` (`id_f`),
  CONSTRAINT `cliants_akks` FOREIGN KEY (`id_c`) REFERENCES `cliants_akks` (`id_c`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `freelanser_dod` (
  `id_fd` INT NOT NULL AUTO_INCREMENT,
  `id_f` INT NULL,
  `rating` FLOAT NULL,
  `bank_cart` VARCHAR(45) NULL,
  PRIMARY KEY (`id_fd`),
  UNIQUE KEY `freelanser_dod_id_f_uq` (`id_f`),
  CONSTRAINT `id_f` FOREIGN KEY (`id_f`) REFERENCES `freelanser_akks` (`id_f`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Payouts to freelancers
CREATE TABLE IF NOT EXISTS `viplsts` (
  `id_v` INT NOT NULL AUTO_INCREMENT,
  `id_f` INT NULL,
  `how_job` INT NULL,
  `how_money` DECIMAL(20,2) NULL,
  `bank_card` VARCHAR(45) NULL,
  `date` DATE NULL,
  PRIMARY KEY (`id_v`),
  INDEX `id_f_idx` (`id_f`),
  CONSTRAINT `viplsts_id_f` FOREIGN KEY (`id_f`) REFERENCES `freelanser_akks` (`id_f`)
) ENGINE = InnoDB;

-- Payments received from clients
CREATE TABLE IF NOT EXISTS `otrimani kohti` (
  `id_k` INT NOT NULL AUTO_INCREMENT,
  `id_c` INT NULL,
  `id_j` INT NULL,
  `price` DECIMAL(20,2) NULL,
  `date` DATETIME NULL,
  PRIMARY KEY (`id_k`),
  INDEX `id_c_idx` (`id_c`),
  INDEX `id_j_idx` (`id_j`),
  CONSTRAINT `id_c` FOREIGN KEY (`id_c`) REFERENCES `cliants_akks` (`id_c`),
  CONSTRAINT `id_j` FOREIGN KEY (`id_j`) REFERENCES `job` (`id_j`) ON DELETE SET NULL
) ENGINE = InnoDB;

-- One conversation per (order, freelancer). sender tells who wrote the message.
CREATE TABLE IF NOT EXISTS `chat` (
  `id_chat` INT NOT NULL AUTO_INCREMENT,
  `id_j` INT NOT NULL,
  `id_f` INT NOT NULL,
  `id_c` INT NOT NULL,
  `sender` ENUM('client','freelancer') NOT NULL DEFAULT 'client',
  `message` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_chat`),
  INDEX `id_jx` (`id_j`),
  INDEX `id_fx` (`id_f`),
  INDEX `id_cx` (`id_c`),
  CONSTRAINT `chat_order_fk` FOREIGN KEY (`id_j`) REFERENCES `job` (`id_j`) ON DELETE CASCADE,
  CONSTRAINT `chat_sender_fk` FOREIGN KEY (`id_f`) REFERENCES `freelanser_akks` (`id_f`) ON DELETE CASCADE,
  CONSTRAINT `chat_receiver_fk` FOREIGN KEY (`id_c`) REFERENCES `cliants_akks` (`id_c`) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `files` (
  `id_file` INT NOT NULL AUTO_INCREMENT,
  `id_j` INT NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `uploaded_by` ENUM('client','freelancer') NULL,
  `uploaded_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_file`),
  INDEX `job_files_fk_idx` (`id_j`),
  CONSTRAINT `job_files_fk` FOREIGN KEY (`id_j`) REFERENCES `job` (`id_j`) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `chat_files` (
  `id_chat_file` INT NOT NULL AUTO_INCREMENT,
  `id_chat` INT NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `uploaded_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_chat_file`),
  INDEX `chat_files_fk_idx` (`id_chat`),
  CONSTRAINT `chat_files_fk` FOREIGN KEY (`id_chat`) REFERENCES `chat` (`id_chat`) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `message_status` (
  `id_status` INT NOT NULL AUTO_INCREMENT,
  `id_chat` INT NOT NULL,
  `is_read` BOOLEAN DEFAULT FALSE,
  `read_at` DATETIME NULL,
  PRIMARY KEY (`id_status`),
  INDEX `message_status_fk_idx` (`id_chat`),
  CONSTRAINT `message_status_fk` FOREIGN KEY (`id_chat`) REFERENCES `chat` (`id_chat`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Notifications for both roles (replaces the client-only notifications_c)
CREATE TABLE IF NOT EXISTS `notifications` (
  `id_n` INT NOT NULL AUTO_INCREMENT,
  `role` ENUM('client','freelancer') NOT NULL,
  `user_id` INT NOT NULL,
  `id_j` INT NULL,
  `message` VARCHAR(500) NOT NULL,
  `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_n`),
  INDEX `notifications_user_idx` (`role`, `user_id`, `is_read`)
) ENGINE = InnoDB;

-- Bookkeeping for the daily cleanup job
CREATE TABLE IF NOT EXISTS `cleanup` (
  `last_cleanup` DATE NOT NULL
) ENGINE = InnoDB;

INSERT INTO `cleanup` (`last_cleanup`)
SELECT '2000-01-01' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `cleanup`);
