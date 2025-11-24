-- FreelanceHub Database
-- Простий SQL скрипт для копіювання в .sql файл

CREATE DATABASE IF NOT EXISTS freelancehub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE freelancehub;

-- Таблиця користувачів
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('freelancer', 'client') NOT NULL,
  avatar VARCHAR(255) DEFAULT 'default-avatar.png',
  phone VARCHAR(50) DEFAULT '',
  telegram VARCHAR(100) DEFAULT '',
  skills TEXT DEFAULT NULL,
  portfolio TEXT DEFAULT NULL,
  hourly_rate DECIMAL(10,2) DEFAULT 0.00,
  bio TEXT DEFAULT NULL,
  company VARCHAR(150) DEFAULT '',
  rating DECIMAL(3,2) DEFAULT 0.00,
  reviews_count INT DEFAULT 0,
  completed_projects INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Таблиця проєктів
CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category ENUM('Веб-розробка','Мобільна розробка','Дизайн','Копірайтинг','Маркетинг','SEO','Відеомонтаж','Переклад','Інше') NOT NULL,
  budget_type ENUM('fixed', 'hourly') NOT NULL DEFAULT 'fixed',
  budget DECIMAL(10,2) NOT NULL,
  deadline DATETIME DEFAULT NULL,
  client_id INT NOT NULL,
  freelancer_id INT DEFAULT NULL,
  status ENUM('open','in_progress','review','completed','cancelled') DEFAULT 'open',
  skills TEXT DEFAULT NULL,
  bids_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  completed_at DATETIME DEFAULT NULL,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Таблиця заявок
CREATE TABLE bids (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  freelancer_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  delivery_time INT NOT NULL,
  cover_letter TEXT NOT NULL,
  status ENUM('pending','accepted','rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_bid (project_id, freelancer_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Таблиця відгуків
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  reviewer_id INT NOT NULL,
  reviewed_user_id INT NOT NULL,
  rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_review (project_id, reviewer_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Таблиця повідомлень
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  content TEXT NOT NULL,
  is_read TINYINT(1) DEFAULT 0,
  read_at DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Таблиця файлів проєктів
CREATE TABLE project_attachments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INT DEFAULT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Таблиця файлів повідомлень
CREATE TABLE message_attachments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  message_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INT DEFAULT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Індекси для швидкого пошуку
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_rating ON users(rating);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_bids_status ON bids(status);
CREATE INDEX idx_messages_unread ON messages(receiver_id, is_read);

-- Тестові дані (можна видалити)
INSERT INTO users (name, email, password, role, phone, telegram, skills, hourly_rate, bio) VALUES
('Іван Петренко', 'ivan@test.com', '$2a$10$example', 'freelancer', '+380501234567', '@ivan', '["JavaScript","React","Node.js"]', 500.00, 'Full-stack розробник'),
('Марія Коваль', 'maria@test.com', '$2a$10$example', 'client', '+380509876543', '@maria', NULL, NULL, NULL);

INSERT INTO projects (title, description, category, budget_type, budget, client_id, status) VALUES
('Створити сайт', 'Потрібен сайт для магазину', 'Веб-розробка', 'fixed', 10000.00, 2, 'open');
