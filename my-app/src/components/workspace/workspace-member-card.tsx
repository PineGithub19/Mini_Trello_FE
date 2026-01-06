import { IMAGES } from "@/lib/images";
import useWorkspaceStore from "@/store/workspace-store";
import type { UserResponse } from "@/types/user";
import { Trash2 } from "lucide-react";
import WorkspaceMemberRemovePopup from "./workspace-member-remove-popup";

const WorkspaceMemberCard = ({
  workspaceMemberRole,
  member,
}: {
  workspaceMemberRole: string;
  member: UserResponse["data"];
}) => {
  const currentWorkspaceOwenerId = useWorkspaceStore(
    (state) => state.currentWorkspaceOwnerId
  );
  const isOwner = currentWorkspaceOwenerId === member.id;

  return (
    <div className="relative flex items-center gap-4 rounded-lg shadow-sm p-2 border border-border hover:shadow-md">
      <img
        className="w-16 h-16 rounded-full"
        src={member.avatar || IMAGES.FALLBACK}
        alt={member.name}
      />
      <div>
        <p className="font-medium">{member.name}</p>
        <p className="text-sm text-muted-foreground">{member.email}</p>
        <p className="text-sm text-muted-foreground">
          Role - {workspaceMemberRole}
        </p>
      </div>
      {!isOwner && (
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
