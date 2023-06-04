-- AlterTable
ALTER TABLE `User` ADD COLUMN `theme` ENUM('system', 'light', 'dark') NOT NULL DEFAULT 'system';
