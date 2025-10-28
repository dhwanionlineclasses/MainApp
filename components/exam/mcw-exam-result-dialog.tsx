// Create @/components/McqExamResultDialog.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock, RotateCcw } from 'lucide-react';
import { McqExamSubmitResponse } from '@/types/exam/mcq-exam';

interface McqExamResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: McqExamSubmitResponse;
  onRetry?: () => void;
}

export function McqExamResultDialog({
  open,
  onOpenChange,
  result,
  onRetry
}: McqExamResultDialogProps) {
  const {
    passed,
    percentage,
    correctAnswers,
    totalQuestionsInExam,
    passThreshold,
    remainingAttemptsToday,
    canRetakeToday,
    attemptNumber,
    message
  } = result;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            {passed ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-600" />
                Congratulations! 🎉
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-600" />
                Try Again
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-base">
            Exam Results - Attempt {attemptNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Score Section */}
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <div className="text-4xl font-bold">
                <span className={passed ? 'text-green-600' : 'text-red-600'}>
                  {percentage}%
                </span>
              </div>
              <Progress
                value={percentage}
                className="h-3"
              />
              <p className="text-sm text-muted-foreground">
                {correctAnswers} out of {totalQuestionsInExam} questions correct
              </p>
            </div>

            {/* Pass/Fail Status */}
            <Badge
              variant={passed ? "default" : "destructive"}
              className="text-sm px-4 py-2"
            >
              {passed ? "PASSED" : "FAILED"} - Need {passThreshold}% to pass
            </Badge>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {correctAnswers}
              </div>
              <div className="text-sm text-green-700">Correct</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {totalQuestionsInExam - correctAnswers}
              </div>
              <div className="text-sm text-red-700">Incorrect</div>
            </div>
          </div>

          {/* Message */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">{message}</p>
          </div>
          {
            passed && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">Great job completing the MCQs! Your video submission is now under review, and your final grade will be released once the examiner completes the evaluation.</p>
              </div>
            )
          }

          {/* Retry Information */}
          <div className="space-y-3">
            {canRetakeToday && remainingAttemptsToday > 0 ? (
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <Clock className="h-4 w-4" />
                <span>
                  You have {remainingAttemptsToday} attempts remaining today
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <Clock className="h-4 w-4" />
                <span>
                  Daily limit reached. You can try again tomorrow.
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Close
            </Button>
            {canRetakeToday && remainingAttemptsToday > 0 && onRetry && (
              <Button
                onClick={() => {
                  onOpenChange(false);
                  onRetry();
                }}
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}