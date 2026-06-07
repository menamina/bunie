// Tests for zod schemas

import {
  searchZod,
  makeOrUpdatePostZod,
  makeOrUpdateCommentZod,
  addOrUpdateInventoryZod,
  updateProfZod,
} from "../zod.js";

it("validates post title and or body strings", () => {
  const body = {
    title: "testing",
    body: "",
  };
});
