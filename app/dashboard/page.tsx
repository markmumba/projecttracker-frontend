"use client";
import useSWR, { mutate } from "swr";
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

// TODO : can view due date of project
// TODO : be alerted if the submission are not enough
// TODO : middleware to check auth so no page can load without auth
// TODO : Adding the sekeletons to every page



function Dashboard() {
  const { user, setUser } = useUserStore();
  
  // Fetch user details
  const { data: userDetails, isLoading: userLoading, error: userError } = useSWR<UserDetails>
    ("/users", fetcher, {
      revalidateOnMount: true,
      refreshInterval: 0,
      dedupingInterval: 0
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
  const { data: projectDetails, isLoading: projectLoading, error: projectError } = useSWR<ProjectDetails>
    (shouldFetch ? "/projects" : null, fetcher, {
      revalidateOnMount: true,
      refreshInterval: 0,
      dedupingInterval: 0
    });

  // Fetch submissions
  const { data: submissions, error: submissionError } = useSWR<SubmissionDetails[]>
    (shouldFetch ? "/submissions/student" : null, fetcher, {
      revalidateOnMount: true,
      refreshInterval: 0,
      dedupingInterval: 0
    });

  // Fetch students (for lecturer)
  const { data: students, error: studentError } = useSWR<UserDetails[]>
    (isLecturer ? "/users/students" : null, fetcher, {
      revalidateOnMount: true,
      refreshInterval: 0,
      dedupingInterval: 0
    });

  // Fetch feedback
  const { data: feedbackDetails, error: feedbackError } = useSWR<FeedbackDetails[]>
    (shouldFetch ? "/feedbacks/student" : null, fetcher, {
      revalidateOnMount: true,
      refreshInterval: 0,
      dedupingInterval: 0
    });

  // Fetch lecturer submissions
  const { data: lecturerSubmissions, error: lecturerSubmissionError } = useSWR<SubmissionDetails[]>
    (isLecturer ? "/submissions/lecturer" : null, fetcher, {
      revalidateOnMount: true,
      refreshInterval: 0,
      dedupingInterval: 0
    });

  // Function to manually refetch all data
  const refetchAllData = () => {
    mutate("/users");
    if (shouldFetch) {
      mutate("/projects");
      mutate("/submissions/student");
      mutate("/feedbacks/student");
    }
    if (isLecturer) {
      mutate("/users/students");
      mutate("/submissions/lecturer");
    }
  };

  // Effect to refetch all data when user changes
  useEffect(() => {
    refetchAllData();
  }, [userDetails?.id]);

  // Loading states
  if (userLoading || projectLoading) {
    return <div>Loading...</div>;
  }

  // Error states
  if (userError || projectError || submissionError || studentError || feedbackError || lecturerSubmissionError) {
    console.error("Error loading data:", { userError, projectError, submissionError, studentError, feedbackError, lecturerSubmissionError });
    return <div>Error loading data. Please try refreshing the page.</div>;
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
            <LecuturerCard userDetails={userDetails} students={students} />
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