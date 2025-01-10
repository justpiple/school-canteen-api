-- DropForeignKey
ALTER TABLE `Stand` DROP FOREIGN KEY `Stand_ownerId_fkey`;

-- AlterTable
ALTER TABLE `Stand` MODIFY `ownerId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Stand` ADD CONSTRAINT `Stand_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
