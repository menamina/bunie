import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPostOpt } from "./ts-queries/queries";
import PostCard from "./postcard";
import CommentCard from "./commentCard";

function PostOpen() {
  const { id } = useParams;

  const {
    data: openedPost,
    error: openPostErr,
    isPending,
  } = useQuery({
    ...getPostOpt(id),
  });

  return (
    <div className="postOpenDIV">
      {isPending && <div>Loading</div>}
      {openPostErr && <div>{openPostErr}</div>}
      {openedPost && (
        <div>
          <div className="post">
            <PostCard post={openedPost.post} />
          </div>
          <div className="commentsUnderPost">
            {openedPost.post.comments.length > 0 && (
              <div className="commentHolder">
                {openedPost.post.comments.map((comment) => (
                  <div className="commentLoaded" key={comment.commentedBy.id}>
                    <CommentCard comment={comment} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PostOpen;
