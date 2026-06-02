import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPostOpt } from "../ts-queries/queries";
import PostCard from "./postcard";
import CommentCard from "./commentCard";

import "../css/postOpen.css";

function PostOpen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const postId = Number(id);

  const goBack = () => navigate(-1);

  const {
    data: openedPost,
    error: openPostErr,
    isPending,
  } = useQuery({
    ...getPostOpt(postId),
  });

  return (
    <div className="postOpenDIV">
      <button onClick={goBack} className="backButton">← Back</button>
      {isPending && <div>Loading</div>}
      {openPostErr && <div>{(openPostErr as any).error}</div>}
      {openedPost && (
        <div>
          <div className="post">
            <PostCard post={openedPost} postOpen={true} />
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
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default PostOpen;
