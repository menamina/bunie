import { mutationOptions, queryOptions } from "@tanstack/react-query";

export const sessionCheckQueryOptions = () => {
  return queryOptions({
    queryKey: ["checkSession"],
    queryFn: sessCheck,
  });
};

export const signUpMutationOptions = () => {
  return mutationOptions({
    nutationFn: signupUser,
  });
};

// functions //

async function sessCheck() {
  const res = await fetch("http://localHost:5555//session-check-API", {
    method: "GET",
    credentials: "include",
  });

  return res.json();
}

async function signupUser(signupData) {
  const res = await fetch("http://localHost:5555//sign-up-API", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(signupData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw errorData.message;
  }

  return await res.json();
}

export default sessionCheckQueryOptions;
