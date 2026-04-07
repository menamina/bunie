import { useState, useOutletContext } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getProfilePosts } from "../ts-queries/queries";

function Overview({ whoseProfile }) {
  const { user } = useOutletContext();

  const {
    data: userPosts,
    isPending,
    error,
  } = useQuery(getProfilePosts(whoseProfile, user));
}

export default Overview;
