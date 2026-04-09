import { useState, useOutletContext } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getProfileFollows } from "./ts-queries/queries";

function Follow({ whoseProfile, view }) {}

export default Follow;
