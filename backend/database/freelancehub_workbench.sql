-- ============================================
-- FreelanceHub Database Schema
-- MySQL Workbench Version
-- ============================================

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- ============================================
-- Schema freelancehub
-- ============================================
DROP SCHEMA IF EXISTS `freelancehub`;
CREATE SCHEMA IF NOT EXISTS `freelancehub` DEFAULT CHARACTER SET utf8mb4;
USE `freelancehub`;

-- ============================================
-- Table `freelancehub`.`users`
-- ============================================
DROP TABLE IF EXISTS `freelancehub`.`users`;

CREATE TABLE IF NOT EXISTS `freelancehub`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('freelancer', 'client') NOT NULL,
  `avatar` VARCHAR(255) NULL DEFAULT 'default-avatar.png',
  `phone` VARCHAR(50) NULL DEFAULT '',
  `telegram` VARCHAR(100) NULL DEFAULT '',
  `skills` JSON NULL COMMENT 'Array of skills for freelancers',
  `portfolio` JSON NULL COMMENT 'Array of portfolio items',
  `hourly_rate` DECIMAL(10,2) NULL DEFAULT 0.00,
  `bio` TEXT NULL,
  `company` VARCHAR(150) NULL DEFAULT '',
  `rating` DECIMAL(3,2) NULL DEFAULT 0.00,
  `reviews_count` INT NULL DEFAULT 0,
  `completed_projects` INT NULL DEFAULT 0,
  `is_active` TINYINT(1) NULL DEFAULT 1,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  INDEX `idx_role` (`role` ASC),
  INDEX `idx_rating` (`rating` ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COMMENT = 'Користувачі платформи (фрілансери та замовники)';

-- ============================================
-- Table `freelancehub`.`projects`
-- ============================================
DROP TABLE IF EXISTS `freelancehub`.`projects`;

CREATE TABLE IF NOT EXISTS `freelancehub`.`projects` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `category` ENUM('Веб-розробка', 'Мобільна розробка', 'Дизайн', 'Копірайтинг', 'Маркетинг', 'SEO', 'Відеомонтаж', 'Переклад', 'Інше') NOT NULL,
  `budget_type` ENUM('fixed', 'hourly') NOT NULL DEFAULT 'fixed',
  `budget` DECIMAL(10,2) NOT NULL,
  `deadline` DATETIME NULL,
  `client_id` INT NOT NULL,
  `freelancer_id` INT NULL,
  `status` ENUM('open', 'in_progress', 'review', 'completed', 'cancelled') NULL DEFAULT 'open',
  `skills` JSON NULL COMMENT 'Required skills for project',
  `bids_count` INT NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `completed_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_project_client_idx` (`client_id` ASC),
  INDEX `fk_project_freelancer_idx` (`freelancer_id` ASC),
  INDEX `idx_status` (`status` ASC),
  INDEX `idx_category` (`category` ASC),
  FULLTEXT INDEX `ft_search` (`title`, `description`),
  CONSTRAINT `fk_project_client`
    FOREIGN KEY (`client_id`)
    REFERENCES `freelancehub`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_project_freelancer`
    FOREIGN KEY (`freelancer_id`)
    REFERENCES `freelancehub`.`users` (`id`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COMMENT = 'Проєкти/завдання на платформі';

-- ============================================
-- Table `freelancehub`.`bids`
-- ============================================
DROP TABLE IF EXISTS `freelancehub`.`bids`;

CREATE TABLE IF NOT EXISTS `freelancehub`.`bids` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `project_id` INT NOT NULL,
  `freelancer_id` INT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `delivery_time` INT NOT NULL COMMENT 'Термін виконання в днях',
  `cover_letter` TEXT NOT NULL,
  `status` ENUM('pending', 'accepted', 'rejected') NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `unique_bid` (`project_id` ASC, `freelancer_id` ASC),
  INDEX `fk_bid_project_idx` (`project_id` ASC),
  INDEX `fk_bid_freelancer_idx` (`freelancer_id` ASC),
  INDEX `idx_status` (`status` ASC),
  CONSTRAINT `fk_bid_project`
    FOREIGN KEY (`project_id`)
    REFERENCES `freelancehub`.`projects` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_bid_freelancer`
    FOREIGN KEY (`freelancer_id`)
    REFERENCES `freelancehub`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COMMENT = 'Заявки фрілансерів на проєкти';

-- ============================================
-- Table `freelancehub`.`reviews`
-- ============================================
DROP TABLE IF EXISTS `freelancehub`.`reviews`;

CREATE TABLE IF NOT EXISTS `freelancehub`.`reviews` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `project_id` INT NOT NULL,
  `reviewer_id` INT NOT NULL COMMENT 'Хто залишив відгук',
  `reviewed_user_id` INT NOT NULL COMMENT 'Кому залишили відгук',
  `rating` TINYINT NOT NULL,
  `comment` TEXT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `unique_review` (`project_id` ASC, `reviewer_id` ASC),
  INDEX `fk_review_project_idx` (`project_id` ASC),
  INDEX `fk_review_reviewer_idx` (`reviewer_id` ASC),
  INDEX `fk_review_reviewed_idx` (`reviewed_user_id` ASC),
  CONSTRAINT `fk_review_project`
    FOREIGN KEY (`project_id`)
    REFERENCES `freelancehub`.`projects` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_review_reviewer`
    FOREIGN KEY (`reviewer_id`)
    REFERENCES `freelancehub`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_review_reviewed`
    FOREIGN KEY (`reviewed_user_id`)
    REFERENCES `freelancehub`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `chk_rating` CHECK ((`rating` >= 1) AND (`rating` <= 5)))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COMMENT = 'Відгуки користувачів';

-- ============================================
-- Table `freelancehub`.`messages`
-- ============================================
DROP TABLE IF EXISTS `freelancehub`.`messages`;

CREATE TABLE IF NOT EXISTS `freelancehub`.`messages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `project_id` INT NOT NULL,
  `sender_id` INT NOT NULL,
  `receiver_id` INT NOT NULL,
  `content` TEXT NOT NULL,
  `is_read` TINYINT(1) NULL DEFAULT 0,
  `read_at` DATETIME NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_message_project_idx` (`project_id` ASC),
  INDEX `fk_message_sender_idx` (`sender_id` ASC),
  INDEX `fk_message_receiver_idx` (`receiver_id` ASC),
  INDEX `idx_unread` (`receiver_id` ASC, `is_read` ASC),
  CONSTRAINT `fk_message_project`
    FOREIGN KEY (`project_id`)
    REFERENCES `freelancehub`.`projects` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_message_sender`
    FOREIGN KEY (`sender_id`)
    REFERENCES `freelancehub`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_message_receiver`
    FOREIGN KEY (`receiver_id`)
    REFERENCES `freelancehub`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COMMENT = 'Повідомлення між користувачами';

-- ============================================
-- Table `freelancehub`.`project_attachments`
-- ============================================
DROP TABLE IF EXISTS `freelancehub`.`project_attachments`;

CREATE TABLE IF NOT EXISTS `freelancehub`.`project_attachments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `project_id` INT NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(500) NOT NULL,
  `file_size` INT NULL COMMENT 'Розмір у байтах',
  `uploaded_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_attachment_project_idx` (`project_id` ASC),
  CONSTRAINT `fk_attachment_project`
    FOREIGN KEY (`project_id`)
    REFERENCES `freelancehub`.`projects` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COMMENT = 'Файли прикріплені до проєктів';

-- ============================================
-- Table `freelancehub`.`message_attachments`
-- ============================================
DROP TABLE IF EXISTS `freelancehub`.`message_attachments`;

CREATE TABLE IF NOT EXISTS `freelancehub`.`message_attachments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `message_id` INT NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(500) NOT NULL,
  `file_size` INT NULL,
  `uploaded_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_msg_attachment_idx` (`message_id` ASC),
  CONSTRAINT `fk_msg_attachment`
    FOREIGN KEY (`message_id`)
    REFERENCES `freelancehub`.`messages` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COMMENT = 'Файли в повідомленнях';

-- ============================================
-- Insert Sample Data (Optional)
-- ============================================

-- Sample Users
INSERT INTO `users` (`name`, `email`, `password`, `role`, `phone`, `telegram`, `skills`, `hourly_rate`, `bio`) VALUES
('Іван Петренко', 'ivan@freelancehub.com', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJK', 'freelancer', '+380501234567', '@ivan_dev', 
 '["JavaScript", "React", "Node.js", "MongoDB"]', 500.00, 'Full-stack розробник з 5 років досвіду. Спеціалізуюсь на веб-додатках.'),
('Марія Коваленко', 'maria@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJK', 'client', '+380509876543', '@maria_client', 
 NULL, NULL, NULL);

-- Sample Project
INSERT INTO `projects` (`title`, `description`, `category`, `budget_type`, `budget`, `client_id`, `status`) VALUES
('Розробка інтернет-магазину одягу', 
 'Потрібен досвідчений розробник для створення сучасного інтернет-магазину одягу з адмін панеллю, інтеграцією оплати та системою управління товарами.',
 'Веб-розробка', 'fixed', 15000.00, 2, 'open');

-- Sample Bid
INSERT INTO `bids` (`project_id`, `freelancer_id`, `amount`, `delivery_time`, `cover_letter`, `status`) VALUES
(1, 1, 14000.00, 21, 
 'Добрий день! Маю великий досвід у розробці інтернет-магазинів. Готовий взятися за ваш проєкт та виконати його якісно в зазначені терміни.',
 'pending');

-- ============================================
-- Restore Settings
-- ============================================
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
