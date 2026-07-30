import AddCourse from "@ui/pages/AddCourse";
import Community from "@ui/pages/Community";
import CourseDetail from "@ui/pages/CourseDetail";
import ChapterDetail from "@ui/pages/ChapterDetail";
import { Courses } from "@ui/pages/Courses";
import Dashboard from "@ui/pages/Dashboard";
import Login from "@ui/pages/Login";
import NotFound from "@ui/pages/NotFound";
import { Users } from "@ui/pages/Users";
import { Route, Routes } from "react-router-dom";
import { useAuthContext } from "../../core/context/AuthContext";
import { Chapters } from "@ui/pages/Chapters.tsx";

export function ProtectedRoute() {
  const { user } = useAuthContext();

  const localStorageUser = localStorage.getItem("user");

  if (!user && !localStorageUser)
    return (
      <Routes>
        <Route path="/*" element={<Login />} />
      </Routes>
    );

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:courseId" element={<CourseDetail />} />
      <Route
        path="/courses/:courseId/chapters/:chapterId"
        element={<ChapterDetail />}
      />
      <Route path="/courses/edit/:courseId" element={<AddCourse />} />
      <Route path="/chapters" element={<Chapters />} />
      <Route path="/community" element={<Community />} />
      <Route path="/users" element={<Users />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
