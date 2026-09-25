-- Prisma schema cannot express CHECK constraints; enforce data integrity in the database too.
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_rating_range" CHECK ("rating" BETWEEN 1 AND 5);
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_price_positive" CHECK ("price" > 0);
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_not_self" CHECK ("authorId" <> "targetId");
