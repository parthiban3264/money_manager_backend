/*
  Warnings:

  - You are about to drop the column `account` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `transaction` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Made the column `category` on table `transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `account`,
    DROP COLUMN `date`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `userId` INTEGER NOT NULL,
    MODIFY `category` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
