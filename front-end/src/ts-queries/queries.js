import { mutationOptions, queryOptions } from "@tanstack/react-query";

export const sessionCheckQueryOptions = () => {
  return queryOptions({
    queryKey: ["checkSession"],
    queryFn: sessCheck,
  });
};

export const loginMutationOptions = () => {
  return mutationOptions({
    mutationFn: loginUser,
  });
};

export const signUpMutationOptions = () => {
  return mutationOptions({
    mutationFn: signupUser,
  });
};

export const getProfileQueryOptions = (username, authUser) => {
  return queryOptions({
    queryKey: ["profile", username],
    queryFn: () => getProfile(username, authUser),
  });
};

export const followMutationOptions = (userID) => {
  return mutationOptions({
    mutationFn: toggleFollow(userID),
  });
};

export const getProfilePosts = (username, authUser) => {
  return queryOptions({
    queryKey: ["profile", username],
    queryFN: getUserPosts(username, authUser),
  });
};

// functions //

async function sessCheck() {
  const res = await fetch("http://localHost:5555/session-check-API", {
    method: "GET",
    credentials: "include",
  });

  return await res.json();
}

async function loginUser(loginINFO) {
  const res = await fetch("http://localHost:5555/login-API", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginINFO),
  });
  if (!res.ok) {
    const errData = await res.json();
    const err = new Error("Login failed");

    if (res.status === 404) {
      err.data = errData.message;
    }

    throw err;
  }
  return await res.json();
}

async function signupUser(signupINFO) {
  const res = await fetch("http://localHost:5555/sign-up-API", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(signupINFO),
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

async function getProfile(username, authUser) {
  const isOwnProfile = authUser?.username === username;

  const endpoint = isOwnProfile
    ? `http://localhost:5555/my-profile-API/${username}`
    : `http://localhost:5555/profile-API/${username}`;

  const res = await fetch(endpoint, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch profile");
  return await res.json();
}

async function toggleFollow(userID) {
  const res = await fetch(`http://localHost:5555/follow/${userID}`, {
    method: "POST",
    credentials: "include",
  });
  return await res.json;
}

async function getUserPosts(username, authUser) {
  const isOwnProfile = authUser?.username === username;

  const endpoint = isOwnProfile
    ? `http://localhost:5555/my-my-posts/${username}`
    : `http://localhost:5555/get-user-posts/${username}`;

  const res = await fetch(endpoint, {
    method: "GET",
    credentials: "include",
  });
  return await res.json;
}
