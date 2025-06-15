import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import StudentForm from "../../components/admin/StudentForm";
import TeacherForm from "../../components/admin/TeacherForm";
import IdeaForm from "../../components/admin/IdeaForm";
import UserManagement from "../../components/admin/UsersManagement";

export default function Dashboard() {
  const navigate = useNavigate();
  const path = useLocation();
  useEffect(() => {
    localStorage.getItem("username") == null ? navigate("/admin/login") : "";
    localStorage.getItem("role") == "user" ? navigate("/") : "";
    localStorage.getItem("role") == "teacher" ? navigate("/admin/teacher/") : "";
console.log(path.pathname);

  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:ml-64 p-8 pt-20 lg:pt-8">
        {path.pathname == "/admin/users" && <StudentForm />}
        {path.pathname == "/admin/teachers" && <TeacherForm />}
        {path.pathname == "/admin/ideas" && <IdeaForm />}
        {path.pathname == "/admin/addusers" && <UserManagement />}
      </div>
    </div>
  );
}
