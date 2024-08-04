'use client';
import SubmissionForm from "@/app/UI/Submission/createsubmission";
import fetcher, { axiosInstance } from "@/app/fetcher/fetcher";
import { CreateSubmissionFormData, ProjectDetails } from "@/app/shared/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

// TODO : Get also the time at which the submission is made 

function Submission() {
    const router = useRouter();

    const { data: project, error: projectError } = useSWR<ProjectDetails>
        ("/projects", fetcher);


    if (projectError) {
        console.log(projectError.response?.data);
    }

    const [formData, setFormData] = useState<CreateSubmissionFormData>({
        project_id: '',
        reviewed: false,
        student_id: '',
        submission_date: '',
        document_path: '',
        description: '',
    });

    useEffect(() => {
        const currentDate = new Date().toISOString().slice(0, 16);
        if (project) {
            setFormData({
                project_id: project?.id ?? '',
                student_id: project?.student?.id ?? '',
                reviewed: false,
                submission_date: currentDate,
                document_path: '',
                description: '',
            });
        } else {
            setFormData(prev => ({
                ...prev,
                submission_date: currentDate,
            }));
        }
    }, [project]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const requestBody = JSON.stringify(formData);
            const response = await axiosInstance.post('/submissions', requestBody);
            console.log('Project created successfully:', response.data);
            setFormData({
                project_id: '',
                reviewed: false,
                student_id: '',
                submission_date: '',
                document_path: '',
                description: '',
            });

            mutate('/submissions/student', async (currentData) => {
                return currentData ? [...currentData, response.data] : [response.data];
            }, false);
            router.push('/dashboard/student/submission');
            mutate('/submissions/student');
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    return (
        <>
            <SubmissionForm formData={formData} handleSubmit={handleSubmit} handleChange={handleChange} />
        </>
    );
}

export default Submission;
