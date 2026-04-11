import { useQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { getFeed } from "./ts-queries/queries";

function Feed() {
  const { user } = useOutletContext();
  const [mainFeedNextPosts, setMainFeedNextPosts] = useState(0);
  const [followingNextPosts, setFollowingNextPosts] = useState(0);

  const {
    data: feed,
    error: feedError,
    isPending: feedPending,
  } = useQuery(getFeed(mainFeedNextPosts));
  //   ON SUCCESS UPDATE THE NUMBER

  const {
    data: thisUsersFollowingFeed,
    error: followingFeedErr,
    isPending: followingPending,
  } = useQuery(getFollowingFeed(followingNextPosts));

  return <div className="feedDIV"></div>;
}

export default Feed;
