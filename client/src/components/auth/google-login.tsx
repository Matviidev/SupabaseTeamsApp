import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
export function GoogleLoginForm() {
  const handleSocialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      //TODO SET CORRECT URL
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "http://localhost:5173/team",
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <button
      onClick={handleSocialLogin}
      type="button"
      className="flex items-center gap-2 border border-stone-200 py-3 px-5 rounded-lg cursor-pointer mt-10"
    >
      <svg
        aria-label="Google logo"
        width="20"
        height="20"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <g>
          <path d="m0 0H512V512H0" fill="#fff"></path>
          <path
            fill="#34a853"
            d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
          ></path>
          <path
            fill="#4285f4"
            d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
          ></path>
          <path
            fill="#fbbc02"
            d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
          ></path>
          <path
            fill="#ea4335"
            d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
          ></path>
        </g>
      </svg>
    </button>
  );
}
