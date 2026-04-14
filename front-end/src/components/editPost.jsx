import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePostOpt } from "./ts-queries/queries";

function EditPost({ postToEdit, closeModal, closeDots }) {
  const [postData, setPostData] = useState({
    title: postToEdit?.posts?.title,
    body: postToEdit?.posts?.body,
    images: [postToEdit?.posts?.img],
  });
}
export default EditPost;
