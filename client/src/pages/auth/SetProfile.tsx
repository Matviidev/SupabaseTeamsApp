import { getProfile } from "@/services/authService";
import { useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth/useAuthStore";

function SetProfile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setProfile = useAuthStore((state) => state.setProfile);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await getProfile();

      if (result.success) {
        setProfile(result.profile);

        toast.success("Profile created successfully");
        navigate("/");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("An error occurred while setting up profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className={cn("flex flex-col gap-6 w-1/2")}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Set up profile</CardTitle>
            <CardDescription>Finish setting up your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="surname">Surname</Label>
                  <Input
                    id="surname"
                    type="text"
                    placeholder="surname"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Continue"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
}

export default SetProfile;
