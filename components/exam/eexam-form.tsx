import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Clock,
  BookOpen,
  Calendar,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { McqExamData, McqExamSubmitType } from "@/types/exam/mcq-exam";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Form schema
const examFormSchema = z.object({
  answers: z
    .record(z.string(), z.string())
    .refine(
      (data) => Object.keys(data).length > 0,
      "Please answer all questions before submitting"
    ),
});

type ExamFormValues = z.infer<typeof examFormSchema>;

interface McqExamFormProps {
  examData: McqExamData;
  onSubmit?: (data: McqExamSubmitType) => void;
  isSubmitting?: boolean;
}

export default function EntranceMcqExamForm({
  examData,
  onSubmit,
  isSubmitting = false,
}: McqExamFormProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [submissions, setSubmissions] = useState<string>("");

  // Sort questions by questionOrder
  const sortedQuestions = [...examData.questions].sort(
    (a, b) => a.questionOrder - b.questionOrder
  );

  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examFormSchema),
    defaultValues: {
      answers: {},
    },
  });

  const watchedAnswers = form.watch("answers");
  
  const answeredCount = Object.entries(watchedAnswers).filter(
     ([_, value]) => value !== undefined && value !== null && value !== "" && String(value).trim() !== ""
  ).length;

  const progressPercentage = (answeredCount / sortedQuestions.length) * 100;
  const currentQuestion = sortedQuestions[currentQuestionIndex];

  const isQuestionAnswered = (questionId: number) => {
    const answer = watchedAnswers[questionId.toString()];
    // return !!(answer && answer.trim() !== "");
    return answer !== undefined && answer !== null && answer.trim() !== "";
  };

  const handleSubmit = (data: ExamFormValues) => {
    // Check if all questions are answered
    const unansweredQuestions = sortedQuestions.filter(
      (q) => !isQuestionAnswered(q.questionId)
    );

    if (unansweredQuestions.length > 0) {
      setShowValidationErrors(true);
      return;
    }

    if (submissions === "") {
      toast("Enter the video url...");
      return;
    }

    // Transform data to the required format
    const submissionData = Object.entries(data.answers)
      .filter(([_, optionId]) => optionId !== undefined && optionId !== null && optionId !== "" && String(optionId).trim() !== "")
      .map(([questionId, optionId]) => ({
        questionId: parseInt(questionId),
        selectedOptionId: parseInt(optionId),
      }));

    // console.log("Submission data:", submissionData);

    if (onSubmit) {
      onSubmit({
        examId: examData.examId,
        responses: submissionData,
        link: submissions,
      });
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < sortedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const getUnansweredQuestions = () => {
    return sortedQuestions.filter((q) => !isQuestionAnswered(q.questionId));
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{examData.title}</CardTitle>
                  <CardDescription className="text-base">
                    {examData.description}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <BookOpen className="h-4 w-4" />
                    {examData.courseName}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Calendar className="h-4 w-4" />
                    {examData.yearName}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Clock className="h-4 w-4" />
                    Week {examData.weekNumber}
                  </Badge>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progress</span>
                  <span>
                    {answeredCount} of {sortedQuestions.length} answered
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Question Navigation */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Questions Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {sortedQuestions.map((question, index) => {
                const isAnswered = isQuestionAnswered(question.questionId);
                const isCurrent = currentQuestionIndex === index;

                return (
                  <Button
                    key={question.questionId}
                    variant={
                      isCurrent
                        ? "default"
                        : isAnswered
                          ? "secondary"
                          : "outline"
                    }
                    size="sm"
                    className={`relative ${isCurrent ? "ring-2 ring-primary" : ""
                      }`}
                    onClick={() => goToQuestion(index)}
                  >
                    {index + 1}
                    {isAnswered && (
                      <CheckCircle className="h-3 w-3 absolute -top-1 -right-1 text-green-600" />
                    )}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Question Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Current Question */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="text-sm">
                    Question {currentQuestionIndex + 1} of{" "}
                    {sortedQuestions.length}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={prevQuestion}
                      disabled={currentQuestionIndex === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={nextQuestion}
                      disabled={
                        currentQuestionIndex === sortedQuestions.length - 1
                      }
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-xl leading-relaxed">
                  {currentQuestion?.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name={`answers.${currentQuestion?.questionId}`}
                  key={currentQuestion?.questionId}
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            // field.onChange(value);
                            form.setValue(
                              `answers.${currentQuestion?.questionId}`,
                              value
                            );
                            setShowValidationErrors(false);
                          }}
                          // value={field.value || ''}
                          value={
                            form.getValues(
                              `answers.${currentQuestion?.questionId}`
                            ) || ""
                          }
                          className="space-y-3"
                        >
                          {currentQuestion?.options
                            .sort((a, b) => a.optionOrder - b.optionOrder)
                            .map((option) => (
                              <div
                                key={option.optionId}
                                className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                              // onClick={() => field.onChange(option.optionId.toString())}
                              // onClick={() => form.setValue(`answers.${currentQuestion?.questionId}`, option.optionId.toString())}
                              // onClick={() => {
                              //   const currentValue = form.getValues(
                              //     `answers.${currentQuestion?.questionId}`
                              //   );
                              //   const newValue = option.optionId.toString();
                              //   // Only set if it's different from current value
                              //   if (currentValue !== newValue) {
                              //     form.setValue(
                              //       `answers.${currentQuestion?.questionId}`,
                              //       newValue
                              //     );
                              //   }
                              // }}
                              >
                                <RadioGroupItem
                                  value={option.optionId.toString()}
                                  className="mt-0.5"
                                />
                                <FormLabel
                                  className="flex-1 cursor-pointer text-base leading-relaxed font-normal"
                                  onClick={() => form.setValue(`answers.${currentQuestion?.questionId}`, option.optionId.toString())}
                                >
                                  {option.optionText}
                                </FormLabel>
                              </div>
                            ))}
                        </RadioGroup>
                      </FormControl>
                      {showValidationErrors && !isQuestionAnswered(currentQuestion?.questionId) && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Please select an answer for this question.
                          </AlertDescription>
                        </Alert>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Navigation and Submit */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col space-y-4">
                  {/* Progress Info */}
                  <div className="text-sm text-muted-foreground text-center">
                    <p>
                      You have answered {answeredCount} out of{" "}
                      {sortedQuestions.length} questions.
                    </p>
                    {answeredCount < sortedQuestions.length && (
                      <p className="text-amber-600 mt-1">
                        Please answer all questions before submitting.
                      </p>
                    )}
                  </div>

                  {/* Show unanswered questions if trying to submit */}
                  {showValidationErrors &&
                    getUnansweredQuestions().length > 0 && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-2">
                            <p className="font-medium">
                              Please answer the following questions:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {getUnansweredQuestions().map((q) => (
                                <Button
                                  key={q.questionId}
                                  variant="destructive"
                                  size="sm"
                                  type="button"
                                  onClick={() =>
                                    goToQuestion(sortedQuestions.indexOf(q))
                                  }
                                >
                                  Question {q.questionOrder}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                  <div className="space-y-2">
                    <Label htmlFor='video'>
                      Link/URL
                    </Label>
                    <Input
                      required
                      id='video'
                      type="url"
                      placeholder="https://example.com or Google Drive link"
                      value={submissions || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSubmissions(e.target.value)
                      }
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="min-w-[120px]"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Exam"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
