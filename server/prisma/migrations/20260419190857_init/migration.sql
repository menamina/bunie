-- CreateEnum
CREATE TYPE "Category" AS ENUM ('skincare', 'cosmetics');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('noStatus', 'inProgress', 'limbo', 'decluttered', 'fullpan');

-- CreateEnum
CREATE TYPE "RepurchaseChoice" AS ENUM ('null', 'no', 'yes', 'maybe', 'ifItWasGifted');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "saltedHash" TEXT NOT NULL,
    "joined" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "pfp" TEXT NOT NULL DEFAULT 'default-icon.png',
    "header" TEXT,
    "bio" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" SERIAL NOT NULL,
    "belongsTo" INTEGER NOT NULL,
    "brand" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "img" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'noStatus',
    "purchaseDate" TEXT,
    "rating" INTEGER,
    "notes" TEXT,
    "wouldBuyAgain" "RepurchaseChoice" NOT NULL DEFAULT 'null',

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowRelation" (
    "id" SERIAL NOT NULL,
    "follower" INTEGER NOT NULL,
    "following" INTEGER NOT NULL,

    CONSTRAINT "FollowRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Posts" (
    "id" SERIAL NOT NULL,
    "madeBy" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "img" TEXT[],
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostLikes" (
    "id" SERIAL NOT NULL,
    "idOfPost" INTEGER NOT NULL,
    "userWhoLiked" INTEGER NOT NULL,
    "dateLiked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "id" SERIAL NOT NULL,
    "idOfPost" INTEGER NOT NULL,
    "userWhoCommented" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentLikes" (
    "id" SERIAL NOT NULL,
    "idOfComment" INTEGER NOT NULL,
    "userWhoLiked" INTEGER NOT NULL,
    "dateLiked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentLikes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userID_key" ON "Profile"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "FollowRelation_follower_following_key" ON "FollowRelation"("follower", "following");

-- CreateIndex
CREATE UNIQUE INDEX "PostLikes_idOfPost_userWhoLiked_key" ON "PostLikes"("idOfPost", "userWhoLiked");

-- CreateIndex
CREATE UNIQUE INDEX "CommentLikes_idOfComment_userWhoLiked_key" ON "CommentLikes"("idOfComment", "userWhoLiked");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_belongsTo_fkey" FOREIGN KEY ("belongsTo") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowRelation" ADD CONSTRAINT "FollowRelation_follower_fkey" FOREIGN KEY ("follower") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowRelation" ADD CONSTRAINT "FollowRelation_following_fkey" FOREIGN KEY ("following") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_madeBy_fkey" FOREIGN KEY ("madeBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLikes" ADD CONSTRAINT "PostLikes_idOfPost_fkey" FOREIGN KEY ("idOfPost") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLikes" ADD CONSTRAINT "PostLikes_userWhoLiked_fkey" FOREIGN KEY ("userWhoLiked") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_idOfPost_fkey" FOREIGN KEY ("idOfPost") REFERENCES "Posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_userWhoCommented_fkey" FOREIGN KEY ("userWhoCommented") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLikes" ADD CONSTRAINT "CommentLikes_idOfComment_fkey" FOREIGN KEY ("idOfComment") REFERENCES "Comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLikes" ADD CONSTRAINT "CommentLikes_userWhoLiked_fkey" FOREIGN KEY ("userWhoLiked") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
