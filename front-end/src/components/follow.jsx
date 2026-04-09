import { useQuery } from "@tanstack/react-query";
import { getFollow } from "../ts-queries/queries";

function Follow({ whoseProfile, view }) {
  const [VIEW, setVIEW] = useState(view);

  const {
    data: followData,
    error: followError,
    isPending,
  } = useQuery(getFollow(whoseProfile.username, view));

  if (isPending) {
    return <div>Loading {view}...</div>;
  }

  if (followError) {
    return <div>Error: {followError.message}</div>;
  }

  return (
    <div>
      <div>
        <div
          onClick={() => setVIEW("followers")}
          className={
            VIEW === "followers" ? "selectedView follow" : "notSelected follow"
          }
        >
          Followers
        </div>
        <div
          onClick={() => setVIEW("followers")}
          className={
            VIEW === "followers" ? "selectedView follow" : "notSelected follow"
          }
        >
          Following
        </div>
      </div>
    </div>
  );
}

export default Follow;
