import placeholder from "../assets/placeholder.svg";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth/useAuthStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";

function Avatar() {
  const profile = useAuthStore((state) => state.profile);
  const firstLetter = profile?.fullName![0];
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      clearAuth();
      navigate("/login");
      toast.success("You were successfully logged out");
    } catch (error) {
      console.error("Failed to log out:", error);
      toast.error("Something went wrong! Try again later");
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {!firstLetter ? (
          <img
            src={placeholder}
            alt="profile picture"
            width={55}
            className="cursor-pointer"
          />
        ) : (
          <div className="relative cursor-pointer w-16 h-16 rounded-full bg-stone-900 flex items-center justify-center border border-gray-200">
            <p className="text-3xl text-white">{firstLetter}</p>
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-600 border-2 border-white rounded-full" />
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end">
        <DropdownMenuLabel className="font-bold text-stone-900 text-lg">
          My Account
        </DropdownMenuLabel>

        <DropdownMenuLabel className="font-normal">
          {profile?.fullName}
          <Badge className="bg-emerald-600 ml-2">Online</Badge>
        </DropdownMenuLabel>
        <DropdownMenuLabel className="font-normal">
          {user?.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default Avatar;
