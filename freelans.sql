-- MySQL Script generated by MySQL Workbench
-- Tue Nov  5 12:46:26 2024
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema freelans
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema freelans
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `freelans` DEFAULT CHARACTER SET utf8 ;
USE `freelans` ;

-- -----------------------------------------------------
-- Table `freelans`.`freelanser_akks`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `freelans`.`freelanser_akks` (
  `id_f` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password` VARCHAR(450) NOT NULL,
  `telegram` VARCHAR(45) NOT NULL,
  `phone` VARCHAR(45) NOT NULL,
  `spacialty` VARCHAR(150) NOT NULL,
  `avatar` VARCHAR(255) NULL,
  `about` text NULL,
  PRIMARY KEY (`id_f`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `freelans`.`cliants_akks`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `freelans`.`cliants_akks` (
  `id_c` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password` VARCHAR(450) NOT NULL,
  `telegram` VARCHAR(45) NOT NULL,
  `phone` VARCHAR(45) NOT NULL,
  `rating` FLOAT NULL,
  `avatar` VARCHAR(255) NULL,
  `about` text NULL,
  PRIMARY KEY (`id_c`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `freelans`.`job`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `freelans`.`job` (
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
  PRIMARY KEY (`id_j`),
  INDEX `freelanser_akks_idx` (`id_f` ASC),
  INDEX `cliants_akks_idx` (`id_c` ASC),
  CONSTRAINT `freelanser_akks`
    FOREIGN KEY (`id_f`)
    REFERENCES `freelans`.`freelanser_akks` (`id_f`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `cliants_akks`
    FOREIGN KEY (`id_c`)
    REFERENCES `freelans`.`cliants_akks` (`id_c`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `freelans`.`freelanser_dod`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `freelans`.`freelanser_dod` (
  `id_fd` INT NOT NULL AUTO_INCREMENT,
  `id_f` INT NULL,
  `rating` FLOAT NULL,
  `bank_cart` VARCHAR(45) NULL,
  PRIMARY KEY (`id_fd`),
  INDEX `id_f_idx` (`id_f` ASC),
  CONSTRAINT `id_f`
    FOREIGN KEY (`id_f`)
    REFERENCES `freelans`.`freelanser_akks` (`id_f`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `freelans`.`viplsts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `freelans`.`viplsts` (
  `id_v` INT NOT NULL AUTO_INCREMENT,
  `id_f` INT NULL,
  `how_job` INT NULL,
  `how_money` DECIMAL(20,2) NULL,
  `bank_card` VARCHAR(45) NULL,
  `date` DATE NULL,
  PRIMARY KEY (`id_v`),
  INDEX `id_f_idx` (`id_f` ASC),
  CONSTRAINT `viplsts_id_f`
    FOREIGN KEY (`id_f`)
    REFERENCES `freelans`.`freelanser_akks` (`id_f`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `freelans`.`otrimani kohti`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `freelans`.`otrimani kohti` (
  `id_k` INT NOT NULL AUTO_INCREMENT,
  `id_c` INT NULL,
  `id_j` INT NULL,
  `price` DECIMAL(20,2) NULL,
  `date` DATETIME NULL,
  PRIMARY KEY (`id_k`),
  INDEX `id_c_idx` (`id_c` ASC),
  INDEX `id_j_idx` (`id_j` ASC),
  CONSTRAINT `id_c`
    FOREIGN KEY (`id_c`)
    REFERENCES `freelans`.`cliants_akks` (`id_c`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `id_j`
    FOREIGN KEY (`id_j`)
    REFERENCES `freelans`.`job` (`id_j`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `freelans`.`chat`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `freelans`.`chat` (
  `id_chat` INT NOT NULL AUTO_INCREMENT,
  `id_j` INT NOT NULL,
  `id_f` INT NOT NULL,
  `id_c` INT NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_chat`),
  INDEX `id_jx` (`id_j` ASC),
  INDEX `id_fx` (`id_f` ASC),
  INDEX `id_cx` (`id_c` ASC),
  CONSTRAINT `chat_order_fk`
    FOREIGN KEY (`id_j`)
    REFERENCES `freelans`.`job` (`id_j`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `chat_sender_fk`
    FOREIGN KEY (`id_f`)
    REFERENCES `freelans`.`freelanser_akks` (`id_f`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `chat_receiver_fk`
    FOREIGN KEY (`id_c`)
    REFERENCES `freelans`.`cliants_akks` (`id_c`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `freelans`.`files`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `freelans`.`files` (
  `id_file` INT NOT NULL AUTO_INCREMENT,
  `id_j` INT NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `uploaded_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_file`),
  INDEX `job_files_fk_idx` (`id_j` ASC),
  CONSTRAINT `job_files_fk`
    FOREIGN KEY (`id_j`)
    REFERENCES `freelans`.`job` (`id_j`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `chat_files` (
  `id_chat_file` INT NOT NULL AUTO_INCREMENT,
  `id_chat` INT NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `uploaded_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_chat_file`),
  INDEX `chat_files_fk_idx` (`id_chat` ASC),
  CONSTRAINT `chat_files_fk`
    FOREIGN KEY (`id_chat`)
    REFERENCES `chat` (`id_chat`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE = InnoDB;



-- Таблиця для статусу повідомлень
CREATE TABLE IF NOT EXISTS `freelans`.`message_status` (
  `id_status` INT NOT NULL AUTO_INCREMENT,
  `id_chat` INT NOT NULL,
  `is_read` BOOLEAN DEFAULT FALSE,
  `read_at` DATETIME NULL,
  PRIMARY KEY (`id_status`),
  INDEX `message_status_fk_idx` (`id_chat` ASC),
  CONSTRAINT `message_status_fk`
    FOREIGN KEY (`id_chat`)
    REFERENCES `freelans`.`chat` (`id_chat`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE = InnoDB;




SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
