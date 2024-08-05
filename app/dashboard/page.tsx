"use client";
import useSWR, { mutate, useSWRConfig } from "swr";
import fetcher from "../fetcher/fetcher";
import { DashboardSkeleton, ProjectSkeleton, UserCardSkeleton } from "../UI/skeletons";
import NoProject from "../UI/dashboard/student/noProject";
import Project from "../UI/dashboard/student/project";
import { useUserStore } from "../shared/store";
import StudentCard from "../UI/dashboard/student/studentCard";
import LecuturerCard from "../UI/dashboard/lecturer/lecturerCard";
import Submissions from "../UI/dashboard/lecturer/submissions";
import { useEffect } from "react";
import Feedbacks from "../UI/dashboard/student/feedbacks";
import {
  FeedbackDetails,
  ProjectDetails,
  SubmissionDetails,
  UserDetails,
} from "../shared/types";
import ProgressBar from "../UI/progresbar";
import LecturerCard from "../UI/dashboard/lecturer/lecturerCard";

// TODO : Adding the sekeletons to every page


function Dashboard() {
  const { user, setUser } = useUserStore();
  const { mutate } = useSWRConfig();

  // Fetch user details
  const { data: userDetails, error: userError } = useSWR<UserDetails>
    ("/users", fetcher, {
      revalidateOnMount: true,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        if (retryCount >= 3) return;
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
    });

  // Update Zustand store when user details change
  useEffect(() => {
    if (userDetails && (!user || JSON.stringify(user) !== JSON.stringify(userDetails))) {
      setUser(userDetails);
    }
  }, [userDetails, setUser, user]);

  // Determine if we should fetch other data based on user role
  const shouldFetch = userDetails && userDetails.role !== "lecturer";
  const isLecturer = userDetails && userDetails.role === 'lecturer';

  // Fetch project details
  const { data: projectDetails, error: projectError } = useSWR<ProjectDetails>
    (shouldFetch ? "/projects" : null, fetcher, {
      revalidateOnMount: true,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        if (error.status === 404) return; // Don't retry on 404
        if (retryCount >= 3) return;
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
    });

  // Fetch submissions
  const { data: submissions, error: submissionError } = useSWR<SubmissionDetails[]>
    (shouldFetch ? "/submissions/student" : null, fetcher, {
      revalidateOnMount: true,
    });

  // Fetch students (for lecturer)
  const { data: students, error: studentError } = useSWR<UserDetails[]>
    (isLecturer ? "/users/students" : null, fetcher, {
      revalidateOnMount: true,
    });

  // Fetch feedback
  const { data: feedbackDetails, error: feedbackError } = useSWR<FeedbackDetails[]>
    (shouldFetch ? "/feedbacks/student" : null, fetcher, {
      revalidateOnMount: true,
    });

  // Fetch lecturer submissions
  const { data: lecturerSubmissions, error: lecturerSubmissionError } = useSWR<SubmissionDetails[]>
    (isLecturer ? "/submissions/lecturer" : null, fetcher, {
      revalidateOnMount: true,
    });

  // Loading state
  if (!userDetails && !userError) {
    return <div>Loading...</div>;
  }

  // Error state
  if (userError) {
    return <div>Error loading user data. Please try refreshing the page.</div>;
  }

  // Calculate submission count
  const reviewedSubmissions = submissions?.filter((submission) => submission.reviewed === true);
  const submissionCount = reviewedSubmissions ? reviewedSubmissions.length : 0;

  // Render dashboard based on user role
  if (userDetails?.role === "lecturer") {
    return (
      <div className="">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0 md:w-3/4 p-4 flex-grow">
            <h1 className="text-2xl font-bold mb-4">Welcome back Lecturer {userDetails.name}</h1>
            <h1 className="text-2xl font-bold mb-4">Latest Submissions</h1>
            <Submissions lecturerSubmissions={lecturerSubmissions} />
          </div>
          <div className="md:w-1/4 p-4">
            <LecturerCard userDetails={userDetails} students={students} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProgressBar submissionCount={submissionCount} maxSubmissions={10} />
      <div className="p-4">
        <div className="flex flex-col relative md:flex-row justify-between">
          <div className="mb-4 md:mb-0 md:w-3/4 p-4 flex-grow">
            {projectDetails ? (
              <>
                <Project projectDetails={projectDetails} userDetails={userDetails} />
                <Feedbacks feedbackDetails={feedbackDetails} />
              </>
            ) : (
              <NoProject userDetails={userDetails} />
            )}
          </div>
          <div className="md:w-1/4 p-4">
            <StudentCard
              userDetails={userDetails}
              projectDetails={projectDetails}
              submissionCount={submissionCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;





















