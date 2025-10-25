export interface McqExamOption {
  optionId: number;
  optionText: string;
  optionOrder: number;
}

export interface McqExamQuestion {
  questionId: number;
  question: string;
  questionOrder: number;
  options: McqExamOption[];
}

export interface McqExamData {
  examId: number;
  courseId: number;
  courseName: string;
  yearName: string;
  weekNumber: number;
  type: string;
  title: string;
  description: string;
  isActive: boolean;
  totalMarks: number | null;
  attempts: any[];
  questions: McqExamQuestion[];
}

export interface McqExamResponse {
  statusCode: number;
  data: McqExamData;
  message: string;
  success: boolean;
}

export interface EntranceMcqExamData {
  examId: number;
  courseId: number;
  courseName: string;
  yearName: string;
  weekNumber: number;
  type: string;
  title: string;
  description: string;
  isActive: boolean;
  totalMarks: number | null;
  attempts: any[];
  questions: McqExamQuestion[];
}

export interface EntranceMcqExamResponse {
  statusCode: number;
  data: EntranceMcqExamData;
  message: string;
  success: boolean;
}

export type McqExamSubmitType = {
  examId: number;
  responses: {
    questionId: number;
    selectedOptionId: number;
  }[]
}

export interface McqQuestion {
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
  questionOrder: number;
}


export interface McqExamParams {
  courseId: number;
  yearId: number;
  weekNumber: number;
  type: string;
}

export interface EntranceMcqExamParams {
  courseId: number;
}

export type McqExamSubmitResponse = {
  attemptId: number;
  examId: number;
  attemptNumber: number;
  totalQuestionsInExam: number;
  questionsAnswered: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  percentage: number;
  passed: boolean;
  passThreshold: number;
  remainingAttemptsToday: number;
  canRetakeToday: boolean;
  gradedAt: string;
  message: string;
};

export type McqExamSubmitServerResponse = {
  success: boolean;
  message: string;
  data?: McqExamSubmitResponse;
};