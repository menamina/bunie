import { useQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { getFeedOpt, getFollowingFeedOpt } from "./ts-queries/queries";

function Feed() {
  const { user } = useOutletContext();
  const [view, setView] = useState("main");
  const [mainFeedNextPosts, setMainFeedNextPosts] = useState(0);
  const [followingNextPosts, setFollowingNextPosts] = useState(0);

  const {
    data: feed,
    error: feedError,
    isPending: feedPending,
  } = useQuery({
    ...getFeedOpt(mainFeedNextPosts),
    onSuccess: () => {
        setMainFeedNextPosts((prev) => prev + 50)
    }
  });
  //   ON SUCCESS UPDATE THE NUMBER

  const {
    data: thisUsersFollowingFeed,
    error: followingFeedErr,
    isPending: followingPending,
  } = useQuery({
    ...getFollowingFeedOpt(followingNextPosts),
      onSuccess: () => {
        setFollowingNextPosts((prev) => prev + 50)
    }
  });

  return (
    <div className="feedDIV">
      <div>
        <div className={view === "main" ? "selectedView" : "main"}></div>
        <div
          className={view === "following" ? "selectedView" : "following"}
        ></div>
      </div>
      {view === "main" && }
    </div>
  );
}

export default Feed;
