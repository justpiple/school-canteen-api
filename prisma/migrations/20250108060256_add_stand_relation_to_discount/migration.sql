/*
  Warnings:

  - Added the required column `standId` to the `Discount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Discount` ADD COLUMN `standId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Discount` ADD CONSTRAINT `Discount_standId_fkey` FOREIGN KEY (`standId`) REFERENCES `Stand`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
