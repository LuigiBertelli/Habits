/*
  Warnings:

  - The primary key for the `external_users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_external_users" (
    "id" TEXT NOT NULL,
    "social" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    PRIMARY KEY ("id", "social"),
    CONSTRAINT "external_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_external_users" ("id", "social", "user_id") SELECT "id", "social", "user_id" FROM "external_users";
DROP TABLE "external_users";
ALTER TABLE "new_external_users" RENAME TO "external_users";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
