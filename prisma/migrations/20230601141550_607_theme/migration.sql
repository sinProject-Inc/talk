-- AlterTable
ALTER TABLE `User` ADD COLUMN `theme` ENUM('light', 'dark') NOT NULL DEFAULT 'dark';
