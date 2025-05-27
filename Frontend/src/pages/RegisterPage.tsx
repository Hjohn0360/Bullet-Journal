import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <AuthLayout title="Create your account to get started.">
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;