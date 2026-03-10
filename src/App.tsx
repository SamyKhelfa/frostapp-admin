import { Navigate, Route, Routes } from "react-router-dom";
import AddCourse from "./ui/pages/AddCourse";
import Community from "./ui/pages/Community";
import CourseDetail from "./ui/pages/CourseDetail";
import Courses from "./ui/pages/Courses";
import Dashboard from "./ui/pages/Dashboard";
import Login from "./ui/pages/Login";
import Register from "./ui/pages/Register";
import { Users } from "./ui/pages/Users";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:courseId" element={<CourseDetail />} />
      <Route path="/AddCourse" element={<AddCourse />} />
      <Route path="/courses/edit/:courseId" element={<AddCourse />} />
      <Route path="/community" element={<Community />} />
      <Route path="/users" element={<Users />} />

      {/* <Route path="/dashboard/*" element={<ProtectedRoute></ProtectedRoute>} /> */}
    </Routes>
  );
}
