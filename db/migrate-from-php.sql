-- One-time migration of the PHP-era database to the Next.js version.
-- Run once against the existing database, e.g.:
--   mysql -u USER -p nkloqzcz_freelans < db/migrate-from-php.sql
-- Back the database up first.

-- Full Unicode (emoji etc.). The old schema used 3-byte utf8.
ALTER DATABASE CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `freelanser_akks` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `cliants_akks` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `job` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `freelanser_dod` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `viplsts` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `otrimani kohti` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `chat` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `files` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `chat_files` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Orders: creation time (used for sorting and the yearly cleanup)
ALTER TABLE `job` ADD COLUMN `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `job` ADD INDEX `job_status_idx` (`status`);

-- Chat: who sent the message. The old code stored the sender id in both
-- id_f and id_c, so old rows cannot be attributed reliably; they default to 'client'.
ALTER TABLE `chat` ADD COLUMN `sender` ENUM('client','freelancer') NOT NULL DEFAULT 'client' AFTER `id_c`;

-- Files: who uploaded the attachment
ALTER TABLE `files` ADD COLUMN `uploaded_by` ENUM('client','freelancer') NULL AFTER `file_path`;

-- Notifications for both roles
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

-- Copy the old client notifications (skip this statement if notifications_c does not exist)
INSERT INTO `notifications` (`role`, `user_id`, `id_j`, `message`, `is_read`)
SELECT 'client', `id_c`, `id_j`, `message`, `is_read` FROM `notifications_c`;

CREATE TABLE IF NOT EXISTS `cleanup` (
  `last_cleanup` DATE NOT NULL
) ENGINE = InnoDB;

INSERT INTO `cleanup` (`last_cleanup`)
SELECT '2000-01-01' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `cleanup`);
