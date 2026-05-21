import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPostOpt } from "../ts-queries/queries";
import PostCard from "./postcard";
import CommentCard from "./commentCard";

import "../css/postOpen.css";

function PostOpen() {
  const { id } = useParams();
  const postId = Number(id);

  const {
    data: openedPost,
    error: openPostErr,
    isPending,
  } = useQuery({
    ...getPostOpt(postId),
  });

  console.log(openedPost);

  return (
    <div className="postOpenDIV">
      {isPending && <div>Loading</div>}
      {openPostErr && <div>{openPostErr.error}</div>}
      {openedPost && (
        <div>
          <div className="post">
            <PostCard post={openedPost} />
          </div>
          <div className="commentsUnderPost">
            {openedPost?.comments?.length > 0 ? (
              <div className="commentHolder">
                {openedPost?.comments?.map((comment) => (
                  <div className="commentLoaded" key={comment?.id}>
                    <CommentCard comment={comment} />
                  </div>
                ))}
              </div>
            ) : (
              <div>0</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PostOpen;
