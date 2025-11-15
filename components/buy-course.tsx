"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import BuyingOptionsNew from "./buy-course-options-new";
import { courses, CoursesType } from "@/data/constants/courses";
import { Button } from "./ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useFullProfileDetails } from "@/data/get-full-profile";
import { useLastPurchaseDetails } from "@/data/get-last-purchase";
import Link from "next/link";



const BuyCourse = () => {
  const { data: userCourses } = useFullProfileDetails();
  const { data: userLastPurchase } = useLastPurchaseDetails();
  const [selectedCourse, setSelectedCourse] = useState<CoursesType>(courses[0]);
  const router = useRouter();

  const handleSelectingCourse = (course: CoursesType) => {
    setSelectedCourse(course);
  };

  // Function to check if all final exams of a course are passed
  const isCourseCompleted = (courseName: string) => {
    if (!userCourses?.data) return false;

    const purchasedCoursesArray = Object.values(userCourses.data);

    const purchasedCourse = purchasedCoursesArray.find(
      (c: any) => c.courseName === courseName
    );

    if (!purchasedCourse) return false;

    // Flatten all exams from all years
    const allExams = purchasedCourse.years.flatMap((year: any) => year.exams ?? []);

    if (allExams.length === 0) return false; // no exams at all

    // Get final exams
    const finalExams = allExams.filter((exam: any) => exam.type === "final");

    if (finalExams.length === 0) return false; // no final exams → course not complete

    // Check if all final exams are passed
    const allFinalsPassed = finalExams.every((exam: any) => {
      const lastAttempt = exam.attempts?.[exam.attempts.length - 1];
      return lastAttempt?.passed === true;
    });

    return allFinalsPassed;
  };



  // Check if next course is available (all previous courses completed)
  const isCourseAvailable = (index: number) => {
    if (index === 0) return true; // first course always available
    if (index === 1) {
      const previousCourse = courses[index - 1];
      console.log(userCourses?.user?.bibhusanActive);
      return isCourseCompleted(previousCourse.name) || userCourses?.user?.bibhusanActive;
    }
    if (index === 2) {
      const previousCourse = courses[index - 1];
      return isCourseCompleted(previousCourse.name) || userCourses?.user?.ratnaActive;
    }
    // previous course
    const previousCourse = courses[index - 1];
    return isCourseCompleted(previousCourse.name);
  };

  return (
    <div className="w-full p-5 rounded-md h-full">
      <div className="w-full flex justify-center items-center gap-6">
        <div className="w-full flex flex-col justify-start items-start gap-2 py-10 pt-6">
          <Label>Select Course</Label>
          <RadioGroup
            value={selectedCourse.name}
            className="flex flex-wrap justify-start items-start gap-6"
          >
            {courses.map((course, index) => {
              const available = isCourseAvailable(index);
              console.log({ available, index });
              return (
                <div key={index} className="flex flex-col gap-1">
                  <Card
                    className={cn(
                      "rounded-md px-6 py-3 cursor-pointer",
                      selectedCourse.name === course.name
                        ? "border border-blue-500"
                        : "",
                      !available ? "opacity-50 cursor-not-allowed" : ""
                    )}
                    onClick={() => available && handleSelectingCourse(course)}
                  >
                    <CardContent className="flex justify-center items-center gap-4 py-2">
                      <RadioGroupItem value={course.name} id={course.name} />
                      <Label className="text-sm font-semibold cursor-pointer select-none">
                        Dhwani {course.name}
                      </Label>
                    </CardContent>
                  </Card>
                  {!available && (
                    <span className="text-xs text-red-500">
                      Finish Previous Course OR <Link className="underline" href={`/exam/emcq/courses/${index + 1}`}>
                        Give Entrance Exam
                      </Link>
                    </span>
                  )}
                </div>
              );
            })}
          </RadioGroup>
        </div>
      </div>
      <div>
        <BuyingOptionsNew course={selectedCourse} userLastPurchase={userLastPurchase} user={userCourses?.user} />
      </div>
    </div>
  );
};

export default BuyCourse;
