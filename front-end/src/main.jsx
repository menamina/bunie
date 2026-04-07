import { React } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./index";
import Profile from "./components/profile";
import Feed from "./components/feed";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Feed /> },
      { path: "/post/:id", element: <PostOpen /> },
      { path: "/comment/:id", element: <CommentOpen /> },
      { path: "/settings", element: <Settings /> },
      { path: "/:username", element: <Profile /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}></RouterProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
