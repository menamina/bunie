import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Welcome from "./components/welcome";
import Nav from "./components/nav";
import { sessionCheckQueryOptions } from "./ts-queries/queries";

function App() {
  const { data, isPending } = useQuery(sessionCheckQueryOptions());

  if (isPending) {
    return;
  }

  return (
    <div className="mainDIV">
      {!data && <Welcome />}
      {data && (
        <>
          <Nav user={data} />
          <Outlet context={{ user: data.user }}></Outlet>
        </>
      )}
    </div>
  );
}

export default App;
