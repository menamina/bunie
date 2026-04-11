import {
  mutationOptions,
  queryOptions,
  infiniteQueryOptions,
} from "@tanstack/react-query";

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

export const followMutationOptions = () => {
  return mutationOptions({
    mutationFn: toggleFollow,
  });
};

export const getProfilePosts = (username, authUser) => {
  return queryOptions({
    queryKey: ["profile", username],
    queryFn: () => getUserPosts(username, authUser),
  });
};

export const addProductMutOpts = () => {
  return mutationOptions({
    mutationFn: addProductToInventory,
  });
};

export const deleteProductMutOpts = () => {
  return mutationOptions({
    mutationFn: deleteProduct,
  });
};

export const getStatusViewOptions = (
  viewAPI,
  whoseProfileUsername,
  authUsername,
) => {
  return queryOptions({
    queryKey: ["view-status", whoseProfileUsername],
    queryFn: () => getViewStatus(viewAPI, whoseProfileUsername, authUsername),
  });
};

export const getFollow = (username, view) => {
  return queryOptions({
    queryKey: ["follow", username, view],
    queryFn: () => getUserFollow(username, view),
  });
};

export const updatePassword = () => {
  return mutationOptions({
    mutationFn: changePassword,
  });
};

export const deleteAccount = () => {
  return mutationOptions({
    mutationFn: deleteMyAcc,
  });
};

export const updateData = () => {
  return mutationOptions({
    mutationFn: updateUserData,
  });
};

export const updateIMGs = () => {
  return mutationOptions({
    mutationFn: updateIMGS,
  });
};

export const getFeedOpt = () => {
  return infiniteQueryOptions({
    queryKey: ["feed"],
    queryFn: ({ pageParam = 0 }) => getFeed(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 50 ? allPages.length * 50 : undefined;
    },
    initialPageParam: 0,
  });
};

export const getFollowingFeedOpt = () => {
  return infiniteQueryOptions({
    queryKey: ["following-feed"],
    queryFn: ({ pageParam = 0 }) => getFollowingFeed(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 50 ? allPages.length * 50 : undefined;
    },
    initialPageParam: 0,
  });
};

export const search = (query) => {
  return queryOptions({
    queryKey: ["search", query],
    queryFn: () => searchThis(query),
    enabled: !!query,
  });
};

export const searchInfinite = (query) => {
  return infiniteQueryOptions({
    queryKey: ["search", query],
    queryFn: ({ pageParam = 0 }) => searchThis(query, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const hasMoreUsers = lastPage.usersWithQuery?.length === 50;
      const hasMorePosts = lastPage.postsWithQuery?.length === 50;
      return hasMoreUsers || hasMorePosts ? allPages.length * 50 : undefined;
    },
    initialPageParam: 0,
    enabled: !!query,
  });
};

export const logoutMut = () => {
  return mutationOptions({
    mutationFn: logout,
  });
};

export const deletePostOpt = () => {
  return mutationOptions({
    mutationFn: deletePost,
  });
};

export const togglePostLike = () => {
  return mutationOptions({
    mutationFn: toggleLike,
  });
};

// functions //
async function toggleLike(postID) {}

async function deletePost(postID) {}

async function logout() {
  const res = await fetch(`http://localhost:5555/log-out`, {
    method: "POST",
    credentials: "include",
  });
  return await res.json();
}

async function getFollowingFeed(numberOfNextPost) {
  const res = await fetch(`http://localhost:5555/following-feed-API`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nextPosts: numberOfNextPost }),
  });
  return await res.json();
}

async function getFeed(numberOfNextPost) {
  const res = await fetch(`http://localhost:5555/main-feed-API`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nextPosts: numberOfNextPost }),
  });
  return await res.json();
}

async function searchThis(query, offset = 0) {
  const res = await fetch(
    `http://localhost:5555/search-API?q=${query}&offset=${offset}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  return await res.json();
}

async function updateIMGS(imgs) {
  const res = await fetch(`http://localHost:5555/update-my-IMGS-API`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(imgs),
  });
  return await res.json();
}

async function updateUserData(staticProfDataUpdate) {
  const res = await fetch(`http://localHost:5555/update-my-profile-API`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(staticProfDataUpdate),
  });
  return await res.json();
}

async function deleteMyAcc() {
  const res = await fetch(`http://localHost:5555/delete-my-account-API`, {
    method: "DELETE",
    credentials: "include",
  });
  return await res.json();
}

async function changePassword(passwordObj) {
  const res = await fetch(`http://localHost:5555/update-my-password-API`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(passwordObj),
  });
  return await res.json();
}

async function getUserFollow(username, view) {
  const res = await fetch(
    `http://localHost:5555/get-user-${view}/:${username}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  return await res.json();
}

async function getViewStatus(viewAPI, whoseProfileUsername, authUsername) {
  if (whoseProfileUsername === authUsername) {
    const res = await fetch(
      `http://localHost:5555/get-my-${viewAPI}/:${authUsername}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
    return await res.json();
  } else {
    const res = await fetch(
      `http://localhost:5555/get-user-${viewAPI}/${whoseProfileUsername}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
    return await res.json();
  }
}

async function addProductToInventory(productToAdd) {
  const res = await fetch("http://localHost:5555/add-to-inventory-API", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productToAdd),
  });

  return await res.json();
}

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
  return await res.json();
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
  return await res.json();
}

async function deleteProduct(productId) {
  const res = await fetch(
    `http://localhost:5555/delete-from-where/${productId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );
  if (!res.ok) throw new Error("Failed to delete product");
  return await res.json();
}
