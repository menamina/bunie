import { useOutletContext } from "react-router-dom";

function MiniProfile({ userProfile }) {
  const { user } = useOutletContext();
}

export default MiniProfile;
