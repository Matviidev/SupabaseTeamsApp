import type React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}
function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex w-full h-screen items-center justify-center">
      {children}
    </div>
  );
}

export default AuthLayout;
