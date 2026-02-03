import AuthLayout from "@/components/layout/AuthLayout";
import { SignUpForm } from "@/components/auth/sign-up-form";

function Signup() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}

export default Signup;
