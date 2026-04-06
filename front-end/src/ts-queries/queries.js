import { queryOptions } from "@tanstack/react-query";

function sessionCheckQueryOptions() {
  return queryOptions({
    queryKey: ["checkSession"],
    queryFn: sessCheck,
  });
}

async function sessCheck() {
  const res = await fetch("http://localHost:5555//session-check-API", {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

export default sessionCheckQueryOptions;
