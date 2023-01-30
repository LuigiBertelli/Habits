/*
  Warnings:

  - You are about to drop the column `expiration_time` on the `users_notification` table. All the data in the column will be lost.
  - Added the required column `expiration_date` to the `users_notification` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users_notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "endpoint" TEXT NOT NULL,
    "expiration_date" DATETIME NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "user_id" TEXT,
    CONSTRAINT "users_notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_users_notification" ("auth", "endpoint", "id", "p256dh", "user_id") SELECT "auth", "endpoint", "id", "p256dh", "user_id" FROM "users_notification";
DROP TABLE "users_notification";
ALTER TABLE "new_users_notification" RENAME TO "users_notification";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
