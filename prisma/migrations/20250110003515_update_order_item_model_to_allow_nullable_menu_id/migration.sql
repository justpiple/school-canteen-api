-- DropForeignKey
ALTER TABLE `OrderItem` DROP FOREIGN KEY `OrderItem_menuId_fkey`;

-- DropIndex
DROP INDEX `OrderItem_menuId_fkey` ON `OrderItem`;

-- AlterTable
ALTER TABLE `OrderItem` MODIFY `menuId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `Menu`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
