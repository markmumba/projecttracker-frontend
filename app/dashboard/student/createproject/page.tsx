'use client'
import CreateProjectForm from "@/app/UI/createprojectform";
import fetcher, { axiosInstance } from "@/app/fetcher/fetcher";
import { CreateProjectFormData, UserDetails } from "@/app/shared/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

function CreateProjectPage() {
    const router = useRouter();

    const { data: lecturersList, error: lecturerListError } = useSWR<UserDetails[]>
        ('/users/lecturers', fetcher);
    console.log(lecturersList)
    if (lecturerListError) {
        console.log(lecturerListError.response?.data);
    }

    const [formData, setFormData] = useState<CreateProjectFormData>({
        title: '',
        lecturer_id: '',
        description: '',
        start_date: '',
        end_date: '',
    });


    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const requestBody = JSON.stringify(formData);
            const response = await axiosInstance.post('/projects', requestBody);
            setFormData({
                title: '',
                lecturer_id: '',
                description: '',
                start_date: '',
                end_date: '',
            });

            router.push('/dashboard');

        } catch (error) {
            console.error('Error creating project:', error);
        }
    };
    return (
        <div>
            <CreateProjectForm formData={formData} handleSubmit={handleSubmit} handleChange={handleChange} lecturersList={lecturersList} />
        </div>
    );
}

export default CreateProjectPage;