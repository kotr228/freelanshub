CREATE TABLE Freelancers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    has_higher_education BOOLEAN DEFAULT FALSE,
    university VARCHAR(255),
    password VARCHAR(255) NOT NULL
);

CREATE TABLE Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    freelancer_id INT,
    description TEXT,
    status ENUM('want_to_take', 'taken', 'completed', 'not_completed') DEFAULT 'want_to_take',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (freelancer_id) REFERENCES Freelancers(id) ON DELETE SET NULL
);
