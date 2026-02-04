import AuthLayout from "@/components/layout/AuthLayout";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";

function UpdatePassword() {
  return (
    <AuthLayout>
      <UpdatePasswordForm />
    </AuthLayout>
  );
}

export default UpdatePassword;
