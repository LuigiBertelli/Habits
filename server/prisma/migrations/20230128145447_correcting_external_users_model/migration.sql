/*
  Warnings:

  - A unique constraint covering the columns `[id,social]` on the table `external_users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "external_users_user_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "external_users_id_social_key" ON "external_users"("id", "social");
