import type { IChapter } from "../interfaces/chapter.interface";

export type MockLesson = {
  id: string;
  title: string;
  description: string;
  chapters: Partial<IChapter>[];
};

export type MockCourse = {
  id: string;
  title: string;
  description: string;
  lessons: MockLesson[];
  createdAt: string;
};

const STORAGE_KEY = "mock-courses";

export function loadMockCourses(): MockCourse[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MockCourse[]) : [];
  } catch (err) {
    console.warn("Unable to load mock courses", err);
    return [];
  }
}

export function saveMockCourse(
  course: Omit<MockCourse, "id" | "createdAt">
): MockCourse {
  const newCourse: MockCourse = {
    ...course,
    id: crypto.randomUUID?.() ?? Date.now().toString(),
    createdAt: new Date().toISOString(),
  };

  const existing = loadMockCourses();
  const next = [...existing, newCourse];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return newCourse;
}

export function clearMockCourses() {
  localStorage.removeItem(STORAGE_KEY);
}
