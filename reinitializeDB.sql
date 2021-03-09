CREATE DATABASE IF NOT EXISTS group28;
USE group28;

DROP TABLE IF EXISTS `group28`.`clientInformation`;
CREATE TABLE IF NOT EXISTS `group28`.`clientInformation` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(45) NOT NULL,
	`password` VARCHAR(45) NOT NULL,
	`addressLine1` VARCHAR(100) NOT NULL,
	`addressLine2` VARCHAR(100) NULL,
	`city` VARCHAR(100) NOT NULL,
	`state` VARCHAR(2) NOT NULL,
	`zipMain` VARCHAR(5) NOT NULL,
	`zipPlus4` VARCHAR(4) NULL,
	PRIMARY KEY(`id`),
	UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE)
	ENGINE = InnoDB;

DROP TABLE IF EXISTS `group28`.`userCredentials`;	
CREATE TABLE IF NOT EXISTS `group28`.`userCredentials`(
	`id` INT NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(45) NOT NULL,
	`password` VARCHAR(45) NOT NULL,
	PRIMARY KEY(`id`),
	UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE)
	ENGINE = InnoDB;

DROP TABLE IF EXISTS `group28`.`fuelQuote`;	
CREATE TABLE IF NOT EXISTS `group28`.`fuelQuote`(
	`id` INT NOT NULL,
	`gallonsRequested` INT(11) NULL,
	`address` VARCHAR(316) NULL,
	`deliveryDate` DATE NULL,
	`unitPrice` FLOAT(11) NULL,
	`totalDue` FLOAT(21) NULL,
	`username` VARCHAR(45) NOT NULL,
	PRIMARY KEY(`id`))
	ENGINE = InnoDB;