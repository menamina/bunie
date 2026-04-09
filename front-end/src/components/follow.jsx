import { useQuery } from "@tanstack/react-query";
import { getFollow } from "../ts-queries/queries";

function Follow({ whoseProfile, view }) {
  const [VIEW, setVIEW] = useState(view);

  const {
    data: followData,
    error: followError,
    isPending,
  } = useQuery(getFollow(whoseProfile.username, VIEW));

  if (isPending) {
    return <div>Loading {view}...</div>;
  }

  if (followError) {
    return <div>Error: {followError.message}</div>;
  }

  return (
    <div className="follopwDIV">
      <div className="followSelection">
        <div
          onClick={() => setVIEW("followers")}
          className={
            VIEW === "followers" ? "selectedView follow" : "notSelected follow"
          }
        >
          Followers
        </div>
        <div
          onClick={() => setVIEW("following")}
          className={
            VIEW === "following" ? "selectedView follow" : "notSelected follow"
          }
        >
          Following
        </div>
      </div>
    </div>
  );
}

export default Follow;
