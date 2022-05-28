import type { RouteObject } from "react-router-dom";
import Home from "./pages/home";
import UserTypePicker from "./pages/userTypePicker";
import Teacher from "./pages/teacher";
import Student from "./pages/student";
import LoginForm from "./pages/login";
import RegisForm from "./pages/register";
import Booking from "./pages/booking";
import NotFound from "./pages/notFound";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
    children: [],
  },
  {
    path: "/userTypePicker",
    element: <UserTypePicker />,
    children: [],
  },
  {
    path: "/teacher",
    element: <Teacher />,
    children: [
      { path: "/teacher/loginPage", element: <LoginForm /> },
      { path: "/teacher/registerPage", element: <RegisForm /> },
    ],
  },
  {
    path: "/student",
    element: <Student />,
    children: [
      { path: "/student/loginPage", element: <LoginForm /> },
      { path: "/student/registerPage", element: <RegisForm /> },
    ],
  },
  {
    path: "/booking",
    element: <Booking />,
    children: [],
  },
  {
    path: "*",
    element: <NotFound />,
    children: [],
  },
];

export default routes;
