"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";
import { useFullProfileDetails } from "@/data/get-full-profile";
import CoursesTable from "./course-table";
import { demoVideos } from "@/data/demo-videos";
import { ShoppingCart, Video } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const ProfileModuleList = () => {
  const router = useRouter()
  const { data: courses, isError, error, isPending } = useFullProfileDetails();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
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
    <div className="w-full flex flex-col min-h-[92vh] rounded-lg flex justify-start items-start p-4 shadow-sm h-full bg-[#e0c4a4]">
      <div className="w-full border rounded-md px-2 py-1 bg-gradient-to-r from-white-200 to-blue-300 transition-colors duration-300 rounded-lg shadow-xl border bg-muted mb-2">
        <span className="font-semibold text-sm">Welcome, {courses?.user?.fullName || courses?.user?.username || 'Student'}</span>
      </div>
      {courses?.data ? (
        <div className="flex flex-col justify-start items-start gap-8 rounded-lg py-1">
          {courses.data ? (
            <CoursesTable data={courses.data} />
          ) : (
            <div className="w-full flex flex-col gap-6">
              <Skeleton className="h-8 w-full mt-2" /> {/* Title skeleton */}
              <table className="w-full border-collapse">
                <thead className="w-full">
                  <tr>
                    <th className="p-4 text-left text-muted-foreground/40 font-semibold">
                      <Skeleton className="h-6 w-1/3" />{" "}
                      {/* Course Name Skeleton */}
                    </th>
                    <th className="p-4 text-left text-muted-foreground/40 font-semibold">
                      <Skeleton className="h-6 w-1/4" /> {/* Start Skeleton */}
                    </th>
                    <th className="p-4 text-left text-muted-foreground/40 font-semibold">
                      <Skeleton className="h-6 w-1/4" /> {/* Status Skeleton */}
                    </th>
                    <th className="p-4 text-left text-muted-foreground/40 font-semibold">
                      <Skeleton className="h-6 w-1/4" /> {/* Module Skeleton */}
                    </th>
                    <th className="p-4 text-left text-muted-foreground/40 font-semibold">
                      <Skeleton className="h-6 w-1/4" />{" "}
                      {/* Progress Skeleton */}
                    </th>
                  </tr>
                </thead>
                <tbody className="w-full">
                  {[...Array(5)].map(
                    (
                      _,
                      index // Assuming 5 skeleton rows
                    ) => (
                      <tr key={index}>
                        <td className="p-4 flex justify-start items-center gap-2">
                          <Skeleton className="h-14 w-14" />{" "}
                          {/* Image Skeleton */}
                          <div className="flex flex-col justify-start items-start">
                            <Skeleton className="h-6 w-3/4" />{" "}
                            {/* Title Skeleton */}
                            <Skeleton className="h-4 w-1/2" />{" "}
                            {/* Subtitle Skeleton */}
                          </div>
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-4 w-1/4" />{" "}
                          {/* Start Date Skeleton */}
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-4 w-1/4" />{" "}
                          {/* Status Skeleton */}
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-4 w-1/4" />{" "}
                          {/* Module Skeleton */}
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-4 w-1/4" />{" "}
                          {/* Progress Skeleton */}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="p-2 rounded-md mt-2 bg-gradient-to-r from-white-200 to-blue-300 transition-colors duration-300 rounded-lg shadow-xl border bg-muted">
            {/* Intro Section */}
            <div className="text-left mb-4">
              <h1 className="text-md font-semibold mb-1">Explore Our Demo Sessions</h1>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-xs">
                Get a glimpse of our teaching style and course content through these demo videos.
                Each session is designed to give you a clear understanding of the learning experience,
                structure, and depth of knowledge our courses offer.
              </p>
            </div>

            {/* Video Cards */}
            <div className="flex flex-wrap gap-2 mb-2">
              {demoVideos.map((video, index) => (
                <div onClick={() => setSelectedVideo(video)} className="bg-white shadow-md border border-gray rounded-md px-4 py-2 cursor-pointer hover:shadow-xl flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  <span className="text-xs">
                    {video.course}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </>
        // <div className="w-full">No Coursed bought yet!</div>
      )}

      {/* Dialog for Demo Video */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-[90vw] p-0 overflow-hidden rounded-xl bg-gradient-to-r from-white-200 to-blue-300 transition-colors duration-300 rounded-lg shadow-xl border bg-muted">
          {selectedVideo && (
            <>
              <DialogHeader className="p-4 border-b bg-[#f8f4f0]">
                <DialogTitle className="text-left text-sm md:text-lg font-semibold">
                  {selectedVideo.course}
                </DialogTitle>
                <DialogDescription className="text-left text-xs md:text-sm text-gray-500">
                  Watch the full demo session to get an overview of our course structure and
                  teaching methodology.
                </DialogDescription>
              </DialogHeader>
              <div className="aspect-video w-full p-2">
                <iframe
                  src={selectedVideo.url}
                  width="100%"
                  height="100%"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="px-3 pb-3">
                <button onClick={() => {
                  router.push('/buy-course')
                }} className="w-fit flex flex-row-reverse items-center gap-2 bg-white rounded-sm px-3 py-2 shadow-lg text-xs border">Buy Course <ShoppingCart className="w-4 h-4" /></button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileModuleList;
