import AuthLayout from "@/components/layout/AuthLayout";
import { GoogleLoginForm } from "@/components/auth/google-login";

function GoogleLogin() {
  return (
    <AuthLayout>
      <GoogleLoginForm />
    </AuthLayout>
  );
}

export default GoogleLogin;
