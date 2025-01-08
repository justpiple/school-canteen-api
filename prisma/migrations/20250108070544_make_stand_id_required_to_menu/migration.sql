/*
  Warnings:

  - Made the column `standId` on table `Menu` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Menu` DROP FOREIGN KEY `Menu_standId_fkey`;

-- DropIndex
DROP INDEX `Menu_standId_fkey` ON `Menu`;

-- AlterTable
ALTER TABLE `Menu` MODIFY `standId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Menu` ADD CONSTRAINT `Menu_standId_fkey` FOREIGN KEY (`standId`) REFERENCES `Stand`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
