'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { axiosInstance } from "../fetcher/fetcher";
import { useAuthStore } from "../shared/store";
import { loginFormData, loginFormErrors } from "../shared/types";
import LoginForm from "../UI/authentication/loginForm";
import Spinner from "../UI/spinner";
import { access } from "fs";

// TODO : Handling persistent authentication state

function Login() {
  const router = useRouter();
  const { setSuccessMessage, successMessage, setAccessToken } = useAuthStore();
  const [formData, setFormData] = useState<loginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<loginFormErrors>({});
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear the error for this field when the user starts typing
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  function validateForm() {

    const newErrors: loginFormErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const requestBody = JSON.stringify(formData);
      const response = await axiosInstance.post('/login', requestBody);
      const accessToken = response.data.access_token
      setAccessToken(accessToken);
      router.push('/dashboard');

    } catch (error) {
      setErrors({ email: 'Invalid email or password' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  }, [successMessage, setSuccessMessage]);

  return (
    <>
      {loading && <Spinner />}
      {successMessage && <div className="bg-green-500 text-white text-center p-3">{successMessage}</div>}
      <LoginForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        errors={errors}
      />
    </>
  );
}

export default Login;