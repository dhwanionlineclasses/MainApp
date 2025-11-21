"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import Link from "next/link";
import { useFullProfileDetails } from "@/data/get-full-profile";

export default function DoubtClearingEmbedd() {
  const { data: courses, isError, error, isPending } = useFullProfileDetails();

  if (isError || error) {
    console.warn('isError: ', isError)
    console.warn('error: ', error)
    return <span className="text-red-600">Some Error Occured. Please check console for more details.</span>;
  }

  if (isPending) {
    return (
      <h1>Loading...</h1>
    )
  }

  if (!courses.success) {
    console.error('Error while fetching profile and course details: ', courses.message)
    return (
      <div className="w-full flex justify-center items-center">
        <h1>Something Went Wrong!</h1>
      </div>
    )
  }

  return (
    <>
      {
        courses?.data && Object.keys(courses.data).length === 0 && courses.user.purchasePlan === null ? <>
          <div className="p-2 rounded-md mt-2 mx-2 bg-gradient-to-r from-white-200 to-blue-300 transition-colors duration-300 rounded-lg shadow-xl border bg-muted">
            {/* Intro Section */}
            <div className="text-left mb-4">
              <h1 className="text-md font-semibold mb-1">Enroll In a Course</h1>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-xs">
                To access our exclusive doubt-clearing features, you must first purchase one of our courses.
                Enroll now to unlock full support and continue your learning journey with us, gaining personalized guidance, structured learning paths, and expert assistance whenever you need it.
              </p>

            </div>

            {/* Video Cards */}
            <div className="flex flex-wrap gap-2 mb-2">
              <Link href={'/buy-course'}>
                <div className="bg-white shadow-md border border-gray rounded-md px-4 py-2 cursor-pointer hover:shadow-xl flex items-center gap-2">
                  <span className="text-xs font-semibold">
                    Explore Courses
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </> : <div className="w-full flex justify-center items-center mt-2 overflow-scrolls">
          <Cal
            namespace="doubt"
            calLink="wahtabla/doubt"
            config={{ layout: "month_view", theme: "light" }}
            className="w-full h-full"
          />
        </div>
      }

    </>
  );
}

