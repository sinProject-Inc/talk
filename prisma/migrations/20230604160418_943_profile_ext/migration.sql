-- AlterTable
ALTER TABLE `User` ADD COLUMN `avatar_extension` ENUM('jpg', 'jpeg', 'png') NOT NULL DEFAULT 'png';
