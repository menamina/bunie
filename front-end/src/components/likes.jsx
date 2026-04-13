import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCommentOpt, toggleCommentLikeOpt } from "./ts-queries/queries";

function Likes({ whoseProfile }) {
    const { user } = useOutletContext()

    const {
        data: userLikes,
        error: likesErr,
        isPending: likesPending,
    } = useQuery({
        getLikeOpts(whoseProfile.n)
    })

}

export default Likes;
