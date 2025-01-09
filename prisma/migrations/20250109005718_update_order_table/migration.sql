/*
  Warnings:

  - Added the required column `standId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `standId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_standId_fkey` FOREIGN KEY (`standId`) REFERENCES `Stand`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
