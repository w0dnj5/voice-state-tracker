-- CreateTable
CREATE TABLE `voice_state_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `guild_id` VARCHAR(191) NOT NULL,
    `connect_at` DATETIME(3) NOT NULL,
    `disconnect_at` DATETIME(3) NOT NULL,
    `duration_minutes` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
