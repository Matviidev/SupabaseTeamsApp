import AuthLayout from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { createTeam, joinTeam } from "@/services/teamService";

function CreateOrJoinTeam() {
  const [name, setName] = useState("");
  const [inviteCode, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setProfile = useAuthStore((state) => state.setProfile);
  const profile = useAuthStore((state) => state.profile);
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!name.trim()) {
      toast.error("Provide a valid name");
      return;
    }
    try {
      const result = await createTeam(name);

      if (result.status === 200) {
        setProfile({
          fullName: profile?.fullName ?? "",
          avatarUrl: profile?.avatarUrl ?? null,
          teamId: result.data.id,
        });

        toast.success("Team created successfully");
        navigate("/team");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response.data.error || "An error occurred while setting up profile",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!inviteCode.trim()) {
      toast.error("Provide a code to join team");
      return;
    }
    try {
      const result = await joinTeam(inviteCode);

      if (result.status === 200) {
        setProfile({
          fullName: profile?.fullName ?? "",
          avatarUrl: profile?.avatarUrl ?? null,
          teamId: result.data.teamId,
        });

        toast.success("You successfully joined the team");
        navigate("/team");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response.data.error || "An error occurred while setting up profile",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-lg mx-auto space-y-6">
        <Card>
          <CardHeader className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 text-center">
              Teams
            </h1>
            <CardDescription className="text-gray-500 text-center">
              Start collaborating by choosing an option below.
            </CardDescription>
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create">Create New Team</TabsTrigger>
                <TabsTrigger value="join">Join Existing Team</TabsTrigger>
              </TabsList>
              <TabsContent value="create">
                <form onSubmit={handleCreateTeam}>
                  <CardContent className="grid gap-4 pt-4">
                    <div className="grid gap-2">
                      <Label htmlFor="create-team-name">Team Name</Label>
                      <Input
                        id="create-team-name"
                        placeholder="My Awesome Team"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading || !name.trim()}
                    >
                      {loading ? "Creating team..." : "Create Team"}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
              <TabsContent value="join">
                <form onSubmit={handleJoinTeam}>
                  <CardContent className="grid gap-4 pt-4">
                    <div className="grid gap-2">
                      <Label htmlFor="join-team-code">Invite Code</Label>
                      <Input
                        id="join-team-code"
                        type="text"
                        placeholder="TEAM-INVITE-CODE"
                        value={inviteCode}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading || !inviteCode.trim()}
                    >
                      {loading ? "Joining team..." : "Join Team"}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </AuthLayout>
  );
}

export default CreateOrJoinTeam;
