import { useMutation } from '@tanstack/react-query'; // Update path as needed
import { McqExamSubmitType, McqExamSubmitServerResponse, McqExamSubmitResponse } from '@/types/exam/mcq-exam';
import { toast } from 'sonner'; // or your preferred toast library
import { useState } from 'react';
import { submitEntranceMcqQuestionsData } from '@/action/exams/submit-entrance-mcq';

export const useSubmitEntranceMcqExam = () => {
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [examResult, setExamResult] = useState<McqExamSubmitResponse | null>(null);

  const mutation = useMutation<McqExamSubmitServerResponse, Error, McqExamSubmitType>({
    mutationFn: async (values: McqExamSubmitType) => await submitEntranceMcqQuestionsData(values),
   onSuccess: (data) => {
      if (data.success && data.data) {
        setExamResult(data.data);
        setShowResultDialog(true);
      } else {
        // Keep toast for actual errors
        toast.error(data.message || 'Submission failed');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit exam');
    },
  });

  return {
    ...mutation,
    showResultDialog,
    setShowResultDialog,
    examResult,
  };
};