import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useNavigate,
} from "react-router";
import Dashboard from "../pages/admin/Dashboard";
import SignIn from "../pages/admin/auth/Signin";
import Sidebar from "../components/admin/Sidebar";
import { BookUser, Settings, User, Lightbulb } from "lucide-react";
import UserSignIn from "../pages/users/auth/UserSignIn";
// import UserSignUp from "../pages/users/auth/UserSignUp";
import StudentPage from "../pages/users/UserPage";
import TeacherSignIn from "../pages/teacher/auth/TeacherSignIn";
// import TeacherSignUp from "../pages/teacher/auth/TeacherSignUp";
import TeacherPage from "../pages/teacher/TeacherPage";
import Home from "../pages/Home";
import HomeButton from "../components/admin/HomeButton";

const adminMenu = [
  { title: "Student", path: "/admin/users", icon: User },
  { title: "Teachers", path: "/admin/teachers", icon: BookUser },
  { title: "Ideas", path: "/admin/ideas", icon: Lightbulb },
  { title: "Add Users", path: "/admin/addusers", icon: User },
];

function Layout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.getItem("username") == null ? navigate("/user/login") : "";
    localStorage.getItem("role") == "user" ? navigate("/user/") : "";
    localStorage.getItem("role") == "teacher" ? navigate("/teacher/") : "";
  }, []);
  return (
    <>
      <HomeButton />

      <Outlet />
    </>
  );
}

function LayoutTeacher() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.getItem("username") == null ? navigate("/teacher/login") : "";
    localStorage.getItem("role") == "user" ? navigate("/user/") : "";
    localStorage.getItem("role") == "teacher" ? navigate("/teacher/") : "";
  }, []);
  return (
    <>
      <HomeButton />
      <Outlet />
    </>
  );
}

function LayoutAdmin() {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.getItem("username") == null ? navigate("/admin/login") : "";
    localStorage.getItem("role") == "user" ? navigate("/user/") : "";
    localStorage.getItem("role") == "teacher" ? navigate("/teacher/") : "";
  }, []);
  return (
    <>
      <HomeButton />

      <div className="block">
        <Sidebar menuItems={adminMenu} logo="Admin Dashboard" />
      </div>
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },

  {
    path: "/admin/login",
    element: <SignIn />,
  },
  {
    path: "/admin",
    element: <LayoutAdmin />,
    children: [
      {
        path: "/admin/users",
        element: <Dashboard />,
      },
      {
        path: "/admin/teachers",
        element: <Dashboard />,
      },
      {
        path: "/admin/ideas",
        element: <Dashboard />,
      },
      {
        path: "/admin/addusers",
        element: <Dashboard />,
      },
    ],
  },

  {
    path: "/teacher",
    element: <LayoutTeacher />,
    children: [
      {
        path: "/teacher/",
        element: <TeacherPage />,
      },
      {
        path: "/teacher/login",
        element: <TeacherSignIn />,
      },
      // {
      //   path: "/teacher/register",
      //   element: <TeacherSignUp />,
      // },
    ],
  },

  {
    path: "/user",
    element: <Layout />,
    children: [
      {
        path: "/user/",
        element: <StudentPage />,
      },
      {
        path: "/user/login",
        element: <UserSignIn />,
      },
      // {
      //   path: "/user/register",
      //   element: <UserSignUp />,
      // },
    ],
  },

  {},
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
