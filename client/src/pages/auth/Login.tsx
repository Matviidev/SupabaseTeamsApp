import AuthLayout from "@/components/layout/AuthLayout";
import { LoginForm } from "@/components/auth/login-form";

function Login() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}

export default Login;
