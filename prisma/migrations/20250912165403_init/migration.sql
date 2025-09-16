/*
  Warnings:

  - You are about to drop the column `fromUserId` on the `transfer` table. All the data in the column will be lost.
  - You are about to drop the column `toUserId` on the `transfer` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `transfer` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(12,2)`.
  - Added the required column `updatedAt` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from` to the `Transfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `Transfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Transfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Transfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `transfer` DROP FOREIGN KEY `Transfer_fromUserId_fkey`;

-- DropForeignKey
ALTER TABLE `transfer` DROP FOREIGN KEY `Transfer_toUserId_fkey`;

-- DropIndex
DROP INDEX `Transfer_fromUserId_fkey` ON `transfer`;

-- DropIndex
DROP INDEX `Transfer_toUserId_fkey` ON `transfer`;

-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `date` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `transfer` DROP COLUMN `fromUserId`,
    DROP COLUMN `toUserId`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `from` VARCHAR(191) NOT NULL,
    ADD COLUMN `to` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL,
    MODIFY `amount` DECIMAL(12, 2) NOT NULL,
    MODIFY `date` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `Note` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transfer` ADD CONSTRAINT `Transfer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Note` ADD CONSTRAINT `Note_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
