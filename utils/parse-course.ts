import { UserProfileApiResponseType, OrderDetails, Module, Year, Month } from "@/schema/types/user-profile-types";

export type ParsedResponse = {
  [courseId: number]: {
    courseName: string;
    vimeoCourseId: string;
    years: {
      yearId: number;
      yearName: string;
      vimeoYearId: string;
      modules: {
        moduleId: number;
        moduleName: string;
        months: {
          monthId: number;
          monthName: string;
          videos: {
            videoId: number;
            videoTitle: string;
            videoUrl: string;
            videoVimeoId: string;
            description: string;
            duration: number;
            thumbnailUrl: string;
          }[];
        }[];
      }[];
    }[];
  };
};

interface UserProfile {
  id: string;
  fullName: string;
  gender: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export type ParsedUserResponse = {
  userId: number;
  username: string;
  email: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  profile: UserProfile;
  purchasePlan?: string;
  bhusanActive?: boolean;
  bibhusanActive?: boolean;
  ratnaActive?: boolean;
}
export type ParsedNextResponse = {
  nextMonth: number;
  nextModule: number;
  nextYear: number;
  hasCourse: boolean
}

export function parseResponse(response: UserProfileApiResponseType): ParsedResponse {
  const parsed: ParsedResponse = {};

  response.orders.forEach((order) => {
    const { type, details } = order;


    switch (type) {
      case "Course": {
        const courseId = details.courseId;

        // Initialize the course if not already present
        if (!parsed[courseId]) {
          parsed[courseId] = {
            courseName: details.courseName,
            vimeoCourseId: details.vimeoCourseId,
            years: [],
          };
        }

        const courseDetails = details as Extract<OrderDetails, { years: Year[] }>;

        // Iterate over each year in the course details
        courseDetails.years.forEach((year) => {
          // Initialize the year
          const yearData = {
            yearId: year.yearId,
            vimeoYearId: year.vimeoYearId,
            yearName: year.yearName,
            modules: [] as {
              moduleId: number;
              moduleName: string;
              months: {
                monthId: number;
                monthName: string;
                videos: {
                  videoId: number;
                  videoTitle: string;
                  videoUrl: string;
                  videoVimeoId: string;
                  description: string;
                  duration: number;
                  thumbnailUrl: string;
                }[];
              }[];
            }[],
          };

          // Add modules to the year
          year.modules.forEach((module) => {
            const moduleData = {
              moduleId: module.moduleId,
              moduleName: module.moduleName,
              months: [] as {
                monthId: number;
                monthName: string;
                videos: {
                  videoId: number;
                  videoTitle: string;
                  videoUrl: string;
                  videoVimeoId: string;
                  description: string;
                  duration: number;
                  thumbnailUrl: string;
                }[];
              }[],
            };

            // Add months to the module
            module.months.forEach((month) => {
              const monthData = {
                monthId: month.monthId,
                monthName: month.monthName,
                videos: month.videos.map((video) => ({
                  videoId: video.videoId,
                  videoTitle: video.videoTitle,
                  videoUrl: video.videoUrl,
                  videoVimeoId: video.videoVimeoId, // Ensure this property exists in the video object
                  description: video.description,
                  duration: video.duration,
                  thumbnailUrl: video.thumbnailUrl,
                })),
              };

              moduleData.months.push(monthData); // Add month to the module
            });

            yearData.modules.push(moduleData); // Add module to the year
          });

          parsed[courseId].years.push(yearData); // Add year to the course
        });

        break;
      }

      case "Year": {
        const { course, details } = order;

        if (!course) return; // Skip if course data is missing

        const courseId = course.courseId;

        // Initialize the course if not already present
        if (!parsed[courseId]) {
          parsed[courseId] = {
            courseName: course.courseName,
            vimeoCourseId: course.vimeoCourseId,
            years: [],
          };
        }

        const yearDetails = details as Extract<OrderDetails, { modules: Module[] }>;

        // Create year data
        const yearData = {
          yearId: yearDetails.yearId,
          yearName: yearDetails.yearName,
          vimeoYearId: yearDetails.vimeoYearId, // Ensure this field exists in the details
          modules: [] as {
            moduleId: number;
            moduleName: string;
            months: {
              monthId: number;
              monthName: string;
              videos: {
                videoId: number;
                videoTitle: string;
                videoUrl: string;
                videoVimeoId: string;
                description: string;
                duration: number;
                thumbnailUrl: string;
              }[];
            }[];
          }[],
        };

        // Add modules to the year
        yearDetails.modules.forEach((module) => {
          const moduleData = {
            moduleId: module.moduleId,
            moduleName: module.moduleName,
            months: [] as {
              monthId: number;
              monthName: string;
              videos: {
                videoId: number;
                videoTitle: string;
                videoUrl: string;
                videoVimeoId: string;
                description: string;
                duration: number;
                thumbnailUrl: string;
              }[];
            }[],
          };

          // Add months to the module
          module.months.forEach((month) => {
            const monthData = {
              monthId: month.monthId,
              monthName: month.monthName,
              videos: month.videos.map((video) => ({
                videoId: video.videoId,
                videoTitle: video.videoTitle,
                videoUrl: video.videoUrl,
                videoVimeoId: video.videoVimeoId, // Ensure this property exists
                description: video.description,
                duration: video.duration,
                thumbnailUrl: video.thumbnailUrl,
              })),
            };

            moduleData.months.push(monthData); // Add month to the module
          });

          yearData.modules.push(moduleData); // Add module to the year
        });

        // Add year to the course
        parsed[courseId].years.push(yearData);

        break;
      }

      case "Module": {
        const { course, year, details } = order;

        if (!course || !year) return; // Skip if course or year data is missing

        const courseId = course.courseId;

        // Initialize the course if not already present
        if (!parsed[courseId]) {
          parsed[courseId] = {
            courseName: course.courseName,
            vimeoCourseId: course.vimeoCourseId,
            years: [],
          };
        }

        const yearIndex = parsed[courseId].years.findIndex(
          (y) => y.yearId === year.yearId
        );

        // Initialize the year if not already present
        if (yearIndex === -1) {
          parsed[courseId].years.push({
            yearId: year.yearId,
            yearName: year.yearName,
            vimeoYearId: year.vimeoYearId,
            modules: [],
          });
        }

        const yearData = parsed[courseId].years.find(
          (y) => y.yearId === year.yearId
        );

        if (!yearData) return; // Safeguard for type-checking

        const moduleDetails = details as Extract<OrderDetails, { months: Month[] }>;

        // Create module data
        const moduleData = {
          moduleId: moduleDetails.moduleId,
          moduleName: moduleDetails.moduleName,
          months: moduleDetails.months.map((month) => ({
            monthId: month.monthId,
            monthName: month.monthName,
            videos: month.videos.map((video) => ({
              videoId: video.videoId,
              videoTitle: video.videoTitle,
              videoUrl: video.videoUrl,
              videoVimeoId: video.videoVimeoId, // Ensure this field exists
              description: video.description,
              duration: video.duration,
              thumbnailUrl: video.thumbnailUrl,
            })),
          })),
        };

        // Add module to the year if not already present
        const moduleIndex = yearData.modules.findIndex(
          (m) => m.moduleId === moduleDetails.moduleId
        );

        if (moduleIndex === -1) {
          yearData.modules.push(moduleData);
        }

        break;
      }

      case "Month": {
        const { course, year, details } = order;

        if (!course || !year || !details) return; // Skip if any essential data is missing

        const courseId = course.courseId;

        // Initialize the course if not already present
        if (!parsed[courseId]) {
          parsed[courseId] = {
            courseName: course.courseName,
            vimeoCourseId: course.vimeoCourseId,
            years: [],
          };
        }

        const yearIndex = parsed[courseId].years.findIndex(
          (y) => y.yearId === year.yearId
        );

        // Initialize the year if not already present
        if (yearIndex === -1) {
          parsed[courseId].years.push({
            yearId: year.yearId,
            yearName: year.yearName,
            vimeoYearId: year.vimeoYearId,
            modules: [],
          });
        }

        const yearData = parsed[courseId].years.find(
          (y) => y.yearId === year.yearId
        );

        if (!yearData) return; // Safeguard for type-checking

        // Find or create the module within the year
        const moduleIndex = yearData.modules.findIndex(
          (m) => m.moduleId === details.moduleId
        );

        if (moduleIndex === -1) {
          yearData.modules.push({
            moduleId: details.moduleId,
            moduleName: "", // Module name is not provided in this case
            months: [],
          });
        }

        const moduleData = yearData.modules.find(
          (m) => m.moduleId === details.moduleId
        );

        if (!moduleData) return; // Safeguard for type-checking

        // Create month data
        const monthData = {
          monthId: details.monthId,
          monthName: details.monthName,
          videos: details.videos.map((video) => ({
            videoId: video.videoId,
            videoTitle: video.videoTitle,
            videoUrl: video.videoUrl,
            videoVimeoId: video.videoVimeoId, // Ensure this field exists
            description: video.description,
            duration: video.duration,
            thumbnailUrl: video.thumbnailUrl,
          })),
        };

        // Add month to the module if not already present
        const monthIndex = moduleData.months.findIndex(
          (m) => m.monthId === details.monthId
        );

        if (monthIndex === -1) {
          moduleData.months.push(monthData);
        }

        break;
      }

    }
  });

  return parsed;
}

