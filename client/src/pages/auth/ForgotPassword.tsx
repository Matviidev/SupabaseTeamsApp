import AuthLayout from "@/components/layout/AuthLayout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

function ForgotPassword() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}

export default ForgotPassword;
