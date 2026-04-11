import { useParams } from "react-router-dom";

function PostOpen() {
  const { id } = useParams;

  const {
    data: openedPost,
    error: openPostErr,
    isPending,
  } = useQuery({
    ...getPostOpt(id),
  });

  return <div className="postOpenDIV"></div>;
}

export default PostOpen;
