-- DropForeignKey
ALTER TABLE "CommentLikes" DROP CONSTRAINT "CommentLikes_idOfComment_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_idOfPost_fkey";

-- DropForeignKey
ALTER TABLE "PostLikes" DROP CONSTRAINT "PostLikes_idOfPost_fkey";

-- AddForeignKey
ALTER TABLE "PostLikes" ADD CONSTRAINT "PostLikes_idOfPost_fkey" FOREIGN KEY ("idOfPost") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_idOfPost_fkey" FOREIGN KEY ("idOfPost") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLikes" ADD CONSTRAINT "CommentLikes_idOfComment_fkey" FOREIGN KEY ("idOfComment") REFERENCES "Comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
