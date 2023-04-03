import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./components/error";
import Root from "./components/root";
import Home from "./components/home";
import Auth from "./components/auth";
import Projects from "./components/projects";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Issues from "./components/issues";
import Ticket from "./components/ticket";

const Default = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/home");
  });
  return <></>;
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "bug-hunter/authenticate",
        element: <Auth />,
      },
      {
        path: "projects/:projectID",
        element: <Projects />,
      },
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "",
        element: <Default />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "issues",
        element: <Issues />,
      },
      {
        path: "issues/:projectID",
        element: <Issues />,
      },
      {
        path: "ticket",
        element: <Default />,
      },
      {
        path: "ticket/:ticketID",
        element: <Ticket />,
      },

      // {
      //   path: "reported",
      //   element: <Admin />,
      // },
      // {
      //   path: "assigned",
      //   element: <Assigned />,
      // },
      // {
      //   path: "analytics",
      //   element: <Analytics />,
      // },
      // {
      //   path: "profile/bugs",
      //   element: <Reported />,
      // },
      // {
      //   path: "ticket/:ticketID",
      //   element: <Ticket />,
      // },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);
export default function App() {
  return <RouterProvider router={router} />;
}
