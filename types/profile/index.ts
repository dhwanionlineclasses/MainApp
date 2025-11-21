export interface User {
  userId: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  profile: UserProfile | null;
}

export interface UserProfile {
  fullName?: string;
  gender?: 'male' | 'female';
  // Add other profile fields as needed
}

export interface Exam {
  examId: number;
  title: string;
  type: 'mcq' | 'assignment' | 'final';
  cleared: boolean;
  attempts: number;
  review: boolean;
  failed: boolean;
  marks: number | null;
}

export interface Week {
  weekNumber: number;
  exams: Exam[];
}

export interface Month {
  monthId: number;
  monthName: string;
  weeks: Week[];
}

export interface Module {
  moduleId: number;
  moduleName: string;
  months: Month[];
}

export interface Year {
  yearId: number;
  yearName: string;
  modules: Module[];
}

export interface Course {
  courseId: number;
  courseName: string;
  years: Year[];
}

export interface BackendProfileResponse {
  user: User;
  courses: Course[];
  orders: any; // Define order structure if needed
}

export interface ProfileDataResponse {
  success: boolean;
  message: string;
  data?: {
    userId: number;
    username: string;
    email: string;
    fullName?: string;
    gender?: 'male' | 'female';
    courses: Course[];
    orders: any; // Define order structure if needed
  };
}