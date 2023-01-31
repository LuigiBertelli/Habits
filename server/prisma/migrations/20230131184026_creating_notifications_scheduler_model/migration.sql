-- CreateTable
CREATE TABLE "scheduled_notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "notification_id" TEXT NOT NULL,
    CONSTRAINT "scheduled_notifications_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "users_notification" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
