-- CreateIndex
CREATE INDEX "CommentLikes_userWhoLiked_idx" ON "CommentLikes"("userWhoLiked");

-- CreateIndex
CREATE INDEX "Comments_idOfPost_idx" ON "Comments"("idOfPost");

-- CreateIndex
CREATE INDEX "FollowRelation_follower_idx" ON "FollowRelation"("follower");

-- CreateIndex
CREATE INDEX "FollowRelation_following_idx" ON "FollowRelation"("following");

-- CreateIndex
CREATE INDEX "Inventory_belongsTo_idx" ON "Inventory"("belongsTo");

-- CreateIndex
CREATE INDEX "PostLikes_userWhoLiked_idx" ON "PostLikes"("userWhoLiked");

-- CreateIndex
CREATE INDEX "Posts_madeBy_idx" ON "Posts"("madeBy");
