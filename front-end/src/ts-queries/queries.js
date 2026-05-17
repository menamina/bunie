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

export const getProfileQueryOptions = (username, authUsername) => {
  return queryOptions({
    queryKey: ["profile", username],
    queryFn: () => getProfile(username, authUsername),
  });
};

export const followMutationOptions = () => {
  return mutationOptions({
    mutationFn: toggleFollow,
  });
};

export const getProfilePosts = (username, authUser) => {
  return queryOptions({
    queryKey: ["profilePosts", username],
    queryFn: () => getUserPosts(username, authUser),
  });
};

export const addProductMutOpts = () => {
  return mutationOptions({
    mutationFn: addProductToInventory,
  });
};

export const updateProductMut = () => {
  return mutationOptions({
    mutationFn: updateProduct,
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

export const updateUData = () => {
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
    queryKey: ["mainFeed"],
    queryFn: ({ pageParam }) => getFeed({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
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
    queryFn: ({ pageParam }) => searchThis({ pageParam, query }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};

export const logoutMut = () => {
  return mutationOptions({
    mutationFn: logout,
  });
};

export const deletePostOpt = (postID) => {
  return mutationOptions({
    mutationFn: () => deletePost(postID),
  });
};

export const deleteCommentOpt = (commentID) => {
  return mutationOptions({
    mutationFn: () => deleteComment(commentID),
  });
};

export const togglePostLikeOpt = (postID) => {
  return mutationOptions({
    mutationFn: () => togglePostLike(postID),
  });
};

export const toggleCommentLikeOpt = (commentID) => {
  return mutationOptions({
    mutationFn: () => toggleCommentLike(commentID),
  });
};

export const getPostOpt = (postID) => {
  return queryOptions({
    queryKey: ["post", postID],
    queryFn: () => getPost(postID),
  });
};

export const makePostMut = () => {
  return mutationOptions({
    mutationFn: makePost,
  });
};

export const updatePostMut = () => {
  return mutationOptions({
    mutationFn: updatePost,
  });
};

export const makeCommentMut = () => {
  return mutationOptions({
    mutationFn: makeComment,
  });
};

export const updateCommentMut = () => {
  return mutationOptions({
    mutationFn: updateComment,
  });
};

export const getLikeOpts = (username) => {
  return queryOptions({
    queryKey: ["profileLikes", username],
    queryFn: () => getLikes(username),
  });
};

export const getMiniProfileOpts = (username, view) => {
  return queryOptions({
    queryKey: ["miniProfile", username],
    queryFn: () => getMiniProfile(username, view),
  });
};

export const getCommentOpts = (commentID) => {
  return queryOptions({
    queryKey: ["comment", commentID],
    queryFn: () => getComment(commentID),
  });
};

// functions //
async function getComment(commentID) {
  const res = await fetch(
    `http://localhost:5555/get-this-comment/${commentID}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!res.ok) {
    const error = new Error();
    if (res.status === 204) {
      error.noComment = "No comment found";
      throw error;
    } else if (res.status === 500) {
      error.serverError = "Server error, try again";
      throw error;
    }
  }
  return res.json();
}

async function getMiniProfile(username, view) {
  const endPoint =
    view === "following"
      ? `http://localhost:5555/get-user-following/${username}`
      : `http://localhost:5555/get-user-followers/${username}`;

  const res = await fetch(endPoint, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const error = new Error();
    if (res.status === 204) {
      view === "followers"
        ? (error.noFollowers = "This user has 0 followers")
        : (error.noFollowers = "This user has 0 followings");
      throw error;
    } else if (res.status === 403) {
      error.noUser === "No user found";
    } else if (res.status === 500) {
      error.serverError = "Server error, try again";
      throw error;
    }
  }
  return await res.json();
}

async function getLikes(username) {
  const res = await fetch(`http://localhost:5555/get-user-likes/${username}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const error = new Error("error");
    if (res.status === 201) {
      error.noUserLikes = "0 likes by this user";
      throw error;
    } else if (res.status === 404) {
      error.noUserFound = "0 likes by this user";
    } else if (res.status === 500) {
      error.serverError = "Server error, try again";
    }
  }

  return await res.json();
}

async function updateProduct(productID, productData) {
  const res = await fetch(
    `http://localhost:5555/update-inventory-status/${productID}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    },
  );
  if (!res.ok) {
    const error = new Error();

    if (res.status === 404) {
      error.notFound = "Product not found";
      throw error;
    } else if (res.status === 500) {
      error.serverError === "Server error, try again";
      throw error;
    }
  }

  return await res.json();
}

async function updateComment(commentToUpdate) {
  const res = await fetch(
    `http://localhost:5555/update-comment/${commentToUpdate.pID}`,
    {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(commentToUpdate.body),
    },
  );

  if (!res.ok) {
    const error = new Error();

    if (res.status === 404) {
      error.commentNotFound = "Comment not found or not yours";
    } else if (res.status === 500) {
      error.serverError = "Server error, try again";
    }
  }
  return await res.json();
}

async function updatePost(postData, postID) {
  const formData = new FormData();
  formData.append("title", postData.title);
  if (postData.body) {
    formData.append("body", postData.body);
  }
  if (postData.image && postData.image.length > 0) {
    postData.image.forEach((img) => {
      formData.append("image", img);
    });
  }

  const res = await fetch(`http://localhost:5555/update-post/${postID}`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const error = new Error();
    if (res.status === 404) {
      error.noPostExists = "Post not found or not yours";
    } else if (res.status === 500) {
      error.serverError = "Server error, try again";
    }
  }

  return await res.json();
}

async function makeComment(commentData) {
  const res = await fetch(`http://localhost:5555/make-comment-API`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(commentData),
  });

  if (!res.ok) {
    const error = new Error();

    if (res.status === 404) {
      error.postNotExisting = "This post no longer exists";
      throw error;
    } else if (res.status === 500) {
      error.serverError = "Server error,";
    }
  }

  return await res.json();
}

async function makePost(postData) {
  const formData = new FormData();
  formData.append("title", postData.title);
  if (postData.body) {
    formData.append("body", postData.body);
  }
  if (postData.image && postData.image.length > 0) {
    postData.image.forEach((img) => {
      formData.append("image", img);
    });
  }

  const res = await fetch(`http://localhost:5555/make-post-API`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const error = new Error();

    if (res.status === 404) {
      error.noPostFoundToCommentOn = "This post no longer exists";
      throw error;
    } else if (res.status === 500) {
      error.serverError = "Server error, try again";
      throw error;
    }
  }

  return await res.json();
}

async function getPost(postID) {
  const res = await fetch(`http://localhost:5555/get-this-post/${postID}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const error = new Error();

    if (res.status === 404) {
      error.postNotFound = "Post not found";
      throw error;
    } else if (res.status === 500) {
      error.serverError = "Server error, try again";
      throw error;
    }
  }

  return await res.json();
}

async function togglePostLike(postID) {
  const res = await fetch(`http://localhost:5555/like-post/${postID}`, {
    method: "PATCH",
    credentials: "include",
  });
  return await res.json();
}

async function toggleCommentLike(commentID) {
  const res = await fetch(`http://localhost:5555/like-comment/${commentID}`, {
    method: "PATCH",
    credentials: "include",
  });
  return await res.json();
}

async function deletePost(postID) {
  const res = await fetch(`http://localhost:5555/delete-post/${postID}`, {
    method: "DELETE",
    credentials: "include",
  });
  return await res.json();
}

async function deleteComment(commentID) {
  const res = await fetch(`http://localhost:5555/delete-comment/${commentID}`, {
    method: "POST",
    credentials: "include",
  });
  return await res.json();
}

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

async function getFeed({ pageParam }) {
  const res = await fetch(
    `http://localhost:5555/main-feed-API?cursor=${pageParam}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  return await res.json();
}

async function searchThis({ pageParam, query }) {
  const res = await fetch(
    `http://localhost:5555/search-API?cursor=${pageParam}&querySearch=${query}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  const data = await res.json();
  console.log(data);
}

async function updateIMGS(imgs) {
  const formData = new FormData();
  if (imgs.pfp) {
    formData.append("pfp", imgs.pfp);
  }
  if (imgs.header) {
    formData.append("header", imgs.header);
  }

  const res = await fetch(`http://localHost:5555/update-my-IMGS-API`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const error = new Error();

    if (res.status === 404) {
      error.userNotFound = "User not found or not your account";
    } else if (res.status === 500) {
      error.serverError = "Server error, try again";
    }
  }

  return await res.json();
}

async function updateUserData(staticProfDataUpdate) {
  const res = await fetch(`http://localHost:5555/update-my-profile-API`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(staticProfDataUpdate),
  });

  if (!res.ok) {
    const error = new Error();
    const data = await res.json();

    if (res.status === 404) {
      error.noPostFound = "Account not found or not yours";
      throw error;
    } else if (res.status === 500) {
      error.serverError = "Server error, try again";
      throw error;
    } else if (res.status === 403) {
      error.otherMessage = data.message;
      throw error;
    }
  }

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

  if (!res.ok) {
    const error = new Error();
    if (res.status === 400) {
      error.noUserFound = "No account found";
      throw error;
    } else if (res.status === 204) {
      error.PasswordsDontMatch = "Current password is incorrect";
      throw error;
    } else if (res.status === 500) {
      error.serverError = "Server error, try again";
      throw error;
    } else if (res.status === 403) {
      const data = await res.json();
      error.validationErrors = data.validationErrors || "Validation failed";
      throw error;
    }
  }

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
      `http://localHost:5555/get-my-${viewAPI}/${authUsername}`,
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
  const formData = new FormData();
  formData.append("brand", productToAdd.brand);
  formData.append("product", productToAdd.product);
  formData.append("category", productToAdd.category);
  formData.append("price", productToAdd.price);
  if (productToAdd.img.length > 0) {
    formData.append("image", productToAdd.img[0]);
  }
  if (productToAdd.status) {
    formData.append("status", productToAdd.status);
  }
  if (productToAdd.purchaseDate) {
    formData.append("dateOpurchase", productToAdd.purchaseDate);
  }
  if (productToAdd.rating) {
    formData.append("rating", productToAdd.rating);
  }
  if (productToAdd.notes) {
    formData.append("notes", productToAdd.notes);
  }
  if (productToAdd.wouldBuyAgain) {
    formData.append("wouldBuyAgain", productToAdd.wouldBuyAgain);
  }

  const res = await fetch("http://localHost:5555/add-to-inventory-API", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return await res.json();
}

async function sessCheck() {
  const res = await fetch("http://localHost:5555/session-check-API", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    return null;
  }

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
    const err = new Error();

    if (res.status === 500) {
      err.error = "Server error";
    } else if (res.status === 400) {
      err.error = errData.validationErrors;
    } else if (res.status === 403) {
      err.error = errData.message;
    }
    throw err;
  }

  return await res.json();
}

async function getProfile(username, authUsername) {
  const isOwnProfile = authUsername === username;

  const endpoint = isOwnProfile
    ? `http://localhost:5555/my-profile-API/${username}`
    : `http://localhost:5555/profile-API/${username}`;

  const res = await fetch(endpoint, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const error = new Error("error");
    if (res.status === 404) {
      error.noUserFound = "No user found";
      throw error;
    } else if (res.status === 500) {
      error.serverError = "Server error, try again";
      throw error;
    } else if (res.status === 403) {
      error.notAuth = "You must be logged in";
      throw error;
    }
  }
  return await res.json();
}

async function toggleFollow(userID) {
  const res = await fetch(`http://localHost:5555/follow/${userID}`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const error = new Error();

    if (res.status === 404) {
      error.noAccountFound = "Account does not exist";
      throw error;
    } else if (res.status === 500) {
      error.serverError = "Server error, try again";
    }
  }

  return await res.json();
}

async function getUserPosts(username, authUsername) {
  const isOwnProfile = authUsername === username ? true : false;

  const endpoint = isOwnProfile
    ? `http://localhost:5555/get-my-posts/${authUsername}`
    : `http://localhost:5555/get-user-posts/${username}`;

  const res = await fetch(endpoint, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const error = new Error("error");

    if (res.status === 404) {
      error.zeroposts = "Nothing to see here";
      throw error;
    } else if (res.status === 500) {
      error.serverError = "Server error, try again";
      throw error;
    } else if (res.status === 403) {
      error.notAuth = "Please sign in";
      throw error;
    }
  }

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
  const data = await res.json();
  if (!res.ok) {
    const error = new Error("error");
    error.backEndError = data.errMsg;
    throw error;
  }
  return data;
}
