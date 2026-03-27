import AddCourse from "@ui/pages/AddCourse";
import Community from "@ui/pages/Community";
import CourseDetail from "@ui/pages/CourseDetail";
import Courses from "@ui/pages/Courses";
import Dashboard from "@ui/pages/Dashboard";
import Login from "@ui/pages/Login";
import NotFound from "@ui/pages/NotFound";
import { Users } from "@ui/pages/Users";
import { Route, Routes } from "react-router-dom";
import { useAuthContext } from "../../core/context/AuthContext";

export function ProtectedRoute() {
  const { user } = useAuthContext();

  const localStorageUser = localStorage.getItem("user");
  
  if (!user && !localStorageUser) return (
    <Routes>
      <Route path="/*" element={<Login />} />
    </Routes>
  );
  
  return (
    <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/AddCourse" element={<AddCourse />} />
        <Route path="/courses/edit/:courseId" element={<AddCourse />} />
        <Route path="/community" element={<Community />} />
        <Route path="/users" element={<Users />} />
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
