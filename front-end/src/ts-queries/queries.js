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
    const errData = await res.json();
    const err = new Error("Signup failed");

    if (res.status === 500) {
      err.data = { serverError: true };
    } else if (res.status === 422) {
      err.data = { validationErrors: errData.errors };
    } else if (res.status === 403) {
      err.data = errData.message;
    }
    throw err;
  }

  return await res.json();
}

export default sessionCheckQueryOptions;
