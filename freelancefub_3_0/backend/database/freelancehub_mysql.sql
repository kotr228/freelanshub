-- ============================================
-- FreelanceHub MySQL Database Schema
-- Створено для PHPMyAdmin / MySQL
-- ============================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Створення бази даних
CREATE DATABASE IF NOT EXISTS `freelancehub` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `freelancehub`;

-- ============================================
-- Таблиця: users (користувачі)
-- Об'єднує фрілансерів та замовників
-- ============================================
CREATE TABLE `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('freelancer', 'client') NOT NULL,
  `avatar` VARCHAR(255) DEFAULT 'default-avatar.png',
  `phone` VARCHAR(50) DEFAULT '',
  `telegram` VARCHAR(100) DEFAULT '',
  
  -- Поля для фрілансерів
  `skills` TEXT DEFAULT NULL COMMENT 'JSON array навичок',
  `portfolio` TEXT DEFAULT NULL COMMENT 'JSON array портфоліо',
  `hourly_rate` DECIMAL(10,2) DEFAULT 0,
  `bio` TEXT DEFAULT NULL,
  
  -- Поля для замовників
  `company` VARCHAR(150) DEFAULT '',
  
  -- Загальні поля
  `rating` DECIMAL(3,2) DEFAULT 0.00,
  `reviews_count` INT(11) DEFAULT 0,
  `completed_projects` INT(11) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`),
  KEY `idx_rating` (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Таблиця: projects (проєкти/завдання)
-- ============================================
CREATE TABLE `projects` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `category` ENUM(
    'Веб-розробка',
    'Мобільна розробка',
    'Дизайн',
    'Копірайтинг',
    'Маркетинг',
    'SEO',
    'Відеомонтаж',
    'Переклад',
    'Інше'
  ) NOT NULL,
  `budget_type` ENUM('fixed', 'hourly') NOT NULL DEFAULT 'fixed',
  `budget` DECIMAL(10,2) NOT NULL,
  `deadline` DATETIME DEFAULT NULL,
  
  `client_id` INT(11) NOT NULL,
  `freelancer_id` INT(11) DEFAULT NULL,
  
  `status` ENUM('open', 'in_progress', 'review', 'completed', 'cancelled') DEFAULT 'open',
  `skills` TEXT DEFAULT NULL COMMENT 'JSON array потрібних навичок',
  `bids_count` INT(11) DEFAULT 0,
  
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `completed_at` DATETIME DEFAULT NULL,
  
  PRIMARY KEY (`id`),
  KEY `idx_client` (`client_id`),
  KEY `idx_freelancer` (`freelancer_id`),
  KEY `idx_status` (`status`),
  KEY `idx_category` (`category`),
  FULLTEXT KEY `ft_search` (`title`, `description`),
  
  CONSTRAINT `fk_project_client` FOREIGN KEY (`client_id`) 
    REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_project_freelancer` FOREIGN KEY (`freelancer_id`) 
    REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Таблиця: bids (заявки на проєкти)
-- ============================================
CREATE TABLE `bids` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `project_id` INT(11) NOT NULL,
  `freelancer_id` INT(11) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `delivery_time` INT(11) NOT NULL COMMENT 'Днів на виконання',
  `cover_letter` TEXT NOT NULL,
  `status` ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_bid` (`project_id`, `freelancer_id`),
  KEY `idx_project` (`project_id`),
  KEY `idx_freelancer` (`freelancer_id`),
  KEY `idx_status` (`status`),
  
  CONSTRAINT `fk_bid_project` FOREIGN KEY (`project_id`) 
    REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bid_freelancer` FOREIGN KEY (`freelancer_id`) 
    REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Таблиця: reviews (відгуки)
-- ============================================
CREATE TABLE `reviews` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `project_id` INT(11) NOT NULL,
  `reviewer_id` INT(11) NOT NULL COMMENT 'Хто залишив відгук',
  `reviewed_user_id` INT(11) NOT NULL COMMENT 'Кому залишили відгук',
  `rating` TINYINT(1) NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
  `comment` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_review` (`project_id`, `reviewer_id`),
  KEY `idx_reviewed_user` (`reviewed_user_id`),
  
  CONSTRAINT `fk_review_project` FOREIGN KEY (`project_id`) 
    REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_reviewer` FOREIGN KEY (`reviewer_id`) 
    REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_reviewed` FOREIGN KEY (`reviewed_user_id`) 
    REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Таблиця: messages (повідомлення)
-- ============================================
CREATE TABLE `messages` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `project_id` INT(11) NOT NULL,
  `sender_id` INT(11) NOT NULL,
  `receiver_id` INT(11) NOT NULL,
  `content` TEXT NOT NULL,
  `is_read` TINYINT(1) DEFAULT 0,
  `read_at` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  KEY `idx_project` (`project_id`),
  KEY `idx_sender` (`sender_id`),
  KEY `idx_receiver` (`receiver_id`),
  KEY `idx_unread` (`receiver_id`, `is_read`),
  
  CONSTRAINT `fk_message_project` FOREIGN KEY (`project_id`) 
    REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_message_sender` FOREIGN KEY (`sender_id`) 
    REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_message_receiver` FOREIGN KEY (`receiver_id`) 
    REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Таблиця: project_attachments (файли проєктів)
-- ============================================
CREATE TABLE `project_attachments` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `project_id` INT(11) NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(500) NOT NULL,
  `file_size` INT(11) DEFAULT NULL COMMENT 'Розмір у байтах',
  `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  KEY `idx_project` (`project_id`),
  
  CONSTRAINT `fk_attachment_project` FOREIGN KEY (`project_id`) 
    REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Таблиця: message_attachments (файли повідомлень)
-- ============================================
CREATE TABLE `message_attachments` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `message_id` INT(11) NOT NULL,
  `filename` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(500) NOT NULL,
  `file_size` INT(11) DEFAULT NULL,
  `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  KEY `idx_message` (`message_id`),
  
  CONSTRAINT `fk_msg_attachment` FOREIGN KEY (`message_id`) 
    REFERENCES `messages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
