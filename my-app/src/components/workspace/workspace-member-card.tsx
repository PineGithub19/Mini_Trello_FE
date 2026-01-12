import useWorkspaceStore from "@/store/workspace-store";
import type { UserResponse } from "@/types/user";
import { Trash2 } from "lucide-react";
import WorkspaceMemberRemovePopup from "./workspace-member-remove-popup";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { extractInitial } from "@/lib/utils";
import useAuthStore from "@/store/auth-store";

const WorkspaceMemberCard = ({
  workspaceMemberRole,
  member,
}: {
  workspaceMemberRole: string;
  member: UserResponse["data"];
}) => {
  const currentWorkspaceOwnerId = useWorkspaceStore(
    (state) => state.currentWorkspaceOwnerId
  );
  const accountId = useAuthStore((state) => state.getAccountId());

  const isOwner = currentWorkspaceOwnerId === accountId;
  console.log(currentWorkspaceOwnerId, accountId, isOwner);
  return (
    <div className="relative flex items-center gap-4 rounded-lg shadow-sm p-2 border border-border hover:shadow-md">
      <Avatar className="size-10 ring-2 ring-background">
        <AvatarImage src={member.avatar || undefined} />
        <AvatarFallback>{extractInitial(member.name)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">{member.name}</p>
        <p className="text-sm text-muted-foreground">{member.email}</p>
        <p className="text-sm text-muted-foreground">
          Role - {workspaceMemberRole}
        </p>
      </div>
      {isOwner && accountId !== member.id && (
        <WorkspaceMemberRemovePopup
          member={member}
          trigger={
            <div className="absolute top-0 right-0 p-2">
              <Trash2 size={16} className="hover:text-destructive" />
            </div>
          }
        />
      )}
    </div>
  );
};

export default WorkspaceMemberCard;
