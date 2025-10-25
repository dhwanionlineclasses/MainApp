"use client";

import { useEntranceMcqQuestionsData } from "@/data/exams/get-entrance-mcq-exam";
import McqExamForm from "./exam-form";
import { ExamFormValues } from "@/lib/validations/exam";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { McqExamSubmitType } from "@/types/exam/mcq-exam";
import { useSubmitEntranceMcqExam } from "@/data/exams/submit-entrance-mcq-exam";
import { McqExamResultDialog } from "./mcw-exam-result-dialog";

interface ExamFormContainerProps {
  courseId: number;
}

export function EntranceExamFormContainer({
  courseId,
}: ExamFormContainerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: examResponse,
    isLoading,
    error,
  } = useEntranceMcqQuestionsData({
    courseId,
  });
  const {
    mutate,
    isPending,
    showResultDialog,
    setShowResultDialog,
    examResult,
  } = useSubmitEntranceMcqExam();

  const handleSubmit = async (data: McqExamSubmitType) => {
    setIsSubmitting(true);
    try {
      // Handle form submission here
      console.log("Exam submitted:", data);

      mutate(data);
      // Example API call:
      // const response = await submitExam({
      //   examId: examResponse?.data.examId,
      //   answers: data.answers,
      // });

      // Show success message or redirect
      console.log("Exam submitted successfully!");
    } catch (error) {
      console.error("Failed to submit exam:", error);
      alert("Failed to submit exam. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Alert variant="destructive" className="bg-white">
          <AlertDescription>
            Failed to load exam: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!examResponse?.data) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Alert variant="destructive" className="bg-white">
          <AlertDescription>No exam data found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleRetry = () => {
    // Reset form or redirect to retry
    window.location.reload(); // or your preferred retry logic
  };

  return (
    <>
      <McqExamForm
        examData={examResponse.data.data}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
      />

      {examResult && (
        <McqExamResultDialog
          open={showResultDialog}
          onOpenChange={setShowResultDialog}
          result={examResult}
          onRetry={handleRetry}
        />
      )}
    </>
  );
}
