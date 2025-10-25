import { EntranceExamFormContainer } from "@/components/exam/eexam-form-container";
import React from "react";

const Page = ({
  params,
}: {
  params: { courseId: string; };
}) => {
  const courseId = parseInt(params.courseId);

  return (
    <div className="w-full min-h-screen flex flex-col justify-start items-center mx-auto">
      <EntranceExamFormContainer courseId={courseId} />
    </div>
  );
};

export default Page;
