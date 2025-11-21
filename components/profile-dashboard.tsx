'use client'

import React from 'react';
import { useProfileData } from '@/data/get-profile-data';
import {
  User,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Calendar,
  Award,
  TrendingUp,
  FileText,
  Target,
  Activity
} from 'lucide-react';

const ProfileDashboard = () => {
  const {
    data,
    isLoading,
    error,
    getFailedExams,
    getExamsForReview,
    getClearedExams,
    getPendingExams,
    getExamProgress,
    getExamsByType
  } = useProfileData();

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-lg w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-red-100">
            <div className="flex items-center space-x-3 text-red-600 mb-4">
              <XCircle className="w-8 h-8" />
              <h2 className="text-xl font-semibold">Error Loading Profile</h2>
            </div>
            <p className="text-gray-600">{data?.message || 'Failed to load profile data'}</p>
          </div>
        </div>
      </div>
    );
  }

  const profileData = data.data;
  const progress = getExamProgress();
  const failedExams = getFailedExams();
  const reviewExams = getExamsForReview();
  const clearedExams = getClearedExams();
  const pendingExams = getPendingExams();
  const mcqExams = getExamsByType('mcq');
  const assignmentExams = getExamsByType('assignment');
  const finalExams = getExamsByType('final');



  interface StatCardProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: number | string;
    subtitle: string;
    color: string;
    bgColor: string;
  }


  const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, subtitle, color, bgColor }) => (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{subtitle}</div>
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
    </div>
  );

  interface ExamCardProps {
    exam: {
      examId: number;
      title: string;
      type: 'mcq' | 'assignment' | 'final';
      cleared: boolean;
      attempts: number;
      review: boolean;
      failed: boolean;
      marks: number | null;
    };
    variant?: 'failed' | 'review' | 'cleared' | 'default';
  }


  const ExamCard: React.FC<ExamCardProps> = ({ exam, variant = 'default' }) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'failed':
          return 'border-red-200 bg-red-50';
        case 'review':
          return 'border-yellow-200 bg-yellow-50';
        case 'cleared':
          return 'border-green-200 bg-green-50';
        default:
          return 'border-gray-200 bg-white';
      }
    };

    const getTypeColor = (type: 'mcq' | 'assignment' | 'final') => {
      switch (type) {
        case 'mcq':
          return 'bg-blue-100 text-blue-800';
        case 'assignment':
          return 'bg-purple-100 text-purple-800';
        case 'final':
          return 'bg-orange-100 text-orange-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div className={`rounded-lg p-4 border ${getVariantStyles()} hover:shadow-sm transition-shadow duration-200`}>
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-medium text-gray-900 text-sm leading-tight">{exam.title}</h4>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(exam.type)}`}>
            {exam.type.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Attempts: {exam.attempts}</span>
          <div className="flex items-center space-x-2">
            {exam.cleared && <CheckCircle className="w-4 h-4 text-green-500" />}
            {exam.failed && <XCircle className="w-4 h-4 text-red-500" />}
            {exam.review && <Eye className="w-4 h-4 text-yellow-500" />}
            {!exam.cleared && !exam.failed && <Clock className="w-4 h-4 text-gray-400" />}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen p-6">
      <div className="max-w-7xl mx-auto">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Target}
            title="Total Exams"
            value={progress.total}
            subtitle="All exams"
            color="text-blue-600"
            bgColor="bg-blue-100"
          />
          <StatCard
            icon={CheckCircle}
            title="Cleared"
            value={progress.cleared}
            subtitle={`${progress.total > 0 ? Math.round((progress.cleared / progress.total) * 100) : 0}% success`}
            color="text-green-600"
            bgColor="bg-green-100"
          />
          <StatCard
            icon={XCircle}
            title="Failed"
            value={progress.failed}
            subtitle="Need retry"
            color="text-red-600"
            bgColor="bg-red-100"
          />
          <StatCard
            icon={Clock}
            title="Pending"
            value={progress.pending}
            subtitle="To attempt"
            color="text-orange-600"
            bgColor="bg-orange-100"
          />
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
              Overall Progress
            </h2>
            <span className="text-sm text-gray-500">
              {progress.cleared} of {progress.total} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress.total > 0 ? (progress.cleared / progress.total) * 100 : 0}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Cleared: {progress.cleared}</span>
            <span>Failed: {progress.failed}</span>
            <span>Pending: {progress.pending}</span>
          </div>
        </div>

        {/* Exam Type Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={FileText}
            title="MCQ Exams"
            value={mcqExams.length}
            subtitle="Multiple choice"
            color="text-blue-600"
            bgColor="bg-blue-100"
          />
          <StatCard
            icon={BookOpen}
            title="Assignments"
            value={assignmentExams.length}
            subtitle="Practical work"
            color="text-purple-600"
            bgColor="bg-purple-100"
          />
          <StatCard
            icon={Award}
            title="Final Exams"
            value={finalExams.length}
            subtitle="Major tests"
            color="text-orange-600"
            bgColor="bg-orange-100"
          />
        </div>

        {/* Exam Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Failed Exams */}
          {failedExams.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <XCircle className="w-5 h-5 mr-2 text-red-500" />
                Failed Exams ({failedExams.length})
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {failedExams.map((exam) => (
                  <ExamCard key={exam.examId} exam={exam} variant="failed" />
                ))}
              </div>
            </div>
          )}

          {/* Review Exams */}
          {reviewExams.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-yellow-500" />
                For Review ({reviewExams.length})
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {reviewExams.map((exam) => (
                  <ExamCard key={exam.examId} exam={exam} variant="review" />
                ))}
              </div>
            </div>
          )}

          {/* Pending Exams */}
          {pendingExams.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-500" />
                Pending Exams ({pendingExams.length})
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {pendingExams.map((exam) => (
                  <ExamCard key={exam.examId} exam={exam} />
                ))}
              </div>
            </div>
          )}

          {/* Recent Cleared Exams */}
          {clearedExams.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Cleared Exams ({clearedExams.length})
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {clearedExams.slice(0, 5).map((exam) => (
                  <ExamCard key={exam.examId} exam={exam} variant="cleared" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Courses Overview */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
            Courses Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {
              Object.values(profileData?.orders || {})?.length === 0 ? (
                <div>No courses enrolled yet.</div>
              ) : (
                Object.values(profileData?.orders || {}).map((course: any, i: number) => {
                  const totalYears = course.years?.length || 0;

                  const totalModules = course.years?.reduce(
                    (sum: number, year: any) => sum + (year.modules?.length || 0),
                    0
                  );

                  const totalMonths = course.years?.reduce(
                    (sumY: number, year: any) =>
                      sumY +
                      year.modules?.reduce(
                        (sumM: number, mod: any) => sumM + (mod.months?.length || 0),
                        0
                      ),
                    0
                  );

                  const totalVideos = course.years?.reduce(
                    (sumY: number, year: any) =>
                      sumY +
                      year.modules?.reduce(
                        (sumM: number, mod: any) =>
                          sumM +
                          mod.months?.reduce(
                            (sumV: number, month: any) => sumV + (month.videos?.length || 0),
                            0
                          ),
                        0
                      ),
                    0
                  );

                  return (
                    <div key={i} className="p-3 rounded border text-xs">
                      <h2 className="font-bold text-sm w-fit">Course: DHWANI {course.courseName}</h2>

                      <div className="grid grid-cols-2 mt-2">
                        <p>• Years: {totalYears}</p>
                        <p>• Modules: {totalModules}</p>
                        <p>• Months: {totalMonths}</p>
                        <p>• Videos: {totalVideos}</p>
                      </div>
                    </div>
                  );
                })
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;