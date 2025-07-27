-- CreateTable
CREATE TABLE "FilterConfiguration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "province" TEXT,
    "probableCause" TEXT,
    "status" TEXT,
    "severity" TEXT
);
