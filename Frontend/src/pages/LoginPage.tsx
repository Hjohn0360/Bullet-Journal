import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <AuthLayout title="Welcome back! Please sign in to your account.">
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;