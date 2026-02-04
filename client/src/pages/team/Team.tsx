import { Button } from "@/components/ui/button";
import { useLeaveTeam } from "@/hooks/team/useLeaveTeam";
import { Copy } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useTeam } from "@/hooks/team/useTeam";
import { usePresenceStore } from "@/store/presence/usePresenceStore";
import { useMemo } from "react";

function Team() {
  const { team, isPending } = useTeam();
  const { leaveTeam, isPending: isLeaving } = useLeaveTeam();
  const onlineMembers = usePresenceStore((state) => state.onlineMembers);

  const sortedTeamMembers = useMemo(() => {
    if (!team?.users) return [];
    const onlineIds = new Set(onlineMembers.map((m) => m.id));
    return [...team.users].sort((a, b) => {
      const aOnline = onlineIds.has(a.id);
      const bOnline = onlineIds.has(b.id);
      if (aOnline && !bOnline) return -1;
      if (!aOnline && bOnline) return 1;
      return a.fullName.localeCompare(b.fullName);
    });
  }, [team?.users, onlineMembers]);

  if (isPending) {
    return (
      <div className="w-full flex items-center justify-center">
        <Spinner variant="bars" size={40} className="text-stone-900" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="w-full flex items-center justify-center text-bold text-xl">
        404 No team found
      </div>
    );
  }

  return (
    <div className="p-6 lg:w-[60%] w-[90%] flex flex-col justify-self-center mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-2xl font-semibold p-0">
              {team.name}
            </CardTitle>
            <span className="text-sm text-stone-500">
              ({team.inviteCode})
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 self-center"
              title="Copy Invite Code"
              onClick={() => {
                navigator.clipboard.writeText(team.inviteCode);
                // toast({ title: "Copied!", description: "Invite code copied to clipboard." });
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Team members: {team.users.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 pt-4 border-t border-stone-200">
            {sortedTeamMembers!.map((member: any) => {
              const firstLetter = member.fullName?.[0];
              const isOnline = onlineMembers.some((m) => m.id === member.id);

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between bg-white shadow rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="flex w-12 h-12 bg-stone-900 rounded-full items-center justify-center text-white text-xl font-bold">
                        {firstLetter}
                      </div>
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 block w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    <div>
                      <p className="font-medium">{member.fullName}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Button
            variant="destructive"
            className="mt-8 max-w-fit self-end"
            onClick={() => {
              if (confirm("Are you sure you want to leave this team?")) {
                leaveTeam();
              }
            }}
            disabled={isLeaving}
          >
            {isLeaving ? "Leaving..." : "Leave Team"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Team;
