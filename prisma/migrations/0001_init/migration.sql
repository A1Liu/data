-- CreateTable
CREATE TABLE "user_account" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "user_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preflop_range_collection" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "preflop_range_collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preflop_range" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "collection_id" UUID NOT NULL,
    "position" TEXT NOT NULL,
    "facing_raise_from" TEXT NOT NULL,
    "decisions" JSONB NOT NULL,

    CONSTRAINT "preflop_range_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "preflop_range_collection_id" ON "preflop_range"("collection_id");

-- AddForeignKey
ALTER TABLE "preflop_range" ADD CONSTRAINT "preflop_range_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "preflop_range_collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
