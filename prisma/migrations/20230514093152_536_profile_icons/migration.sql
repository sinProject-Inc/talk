/*
  Warnings:

  - Added the required column `sender_id` to the `ChatLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `ChatMember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ChatLog` ADD COLUMN `sender_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ChatMember` ADD COLUMN `user_id` INTEGER NOT NULL;
