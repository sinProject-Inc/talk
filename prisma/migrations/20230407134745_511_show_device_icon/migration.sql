/*
  Warnings:

  - Added the required column `is_mobile_device` to the `ChatMember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ChatMember` ADD COLUMN `is_mobile_device` BOOLEAN NOT NULL;
