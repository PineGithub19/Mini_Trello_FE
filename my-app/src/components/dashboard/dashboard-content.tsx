import useWorkspaceStore from "@/store/workspace-store";
import ProjectCard from "../projects/project-card";
import ProjectCardCreate from "../projects/project-card-create";
import WorkspaceCardCreate from "../workspace/workspace-card-create";
import { useFetchProjectsInCurrentWorkspace } from "@/hooks/project-hooks";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PaginationUI from "../custom-ui/pagination-ui";
import { FolderClosed, FileSpreadsheet, Users } from "lucide-react";
import WorkspaceMemeberCardCreate from "../workspace/workspace-member-card-create";
import { useFetchMembersInWorkspace } from "@/hooks/workspace-member-hooks";
import WorkspaceMemberCard from "../workspace/workspace-member-card";

const DashboardContent = () => {
  const [page, setPage] = useState(1);
  const { workspaceId } = useParams<{ workspaceId?: string }>();

  const currentWorkspaceId = useWorkspaceStore(
    (state) => state.currentWorkspaceId
  );
  const currentWorkspaceName = useWorkspaceStore(
    (state) => state.currentWorkspaceName
  );
  const setCurrentWorkspace = useWorkspaceStore(
    (state) => state.setCurrentWorkspace
  );
  const clearCurrentWorkspace = useWorkspaceStore(
    (state) => state.clearCurrentWorkspace
  );

  const workspaceIdentifier = workspaceId ?? currentWorkspaceId ?? "";

  useEffect(() => {
    if (workspaceId) {
      setCurrentWorkspace(workspaceId);
    } else {
      clearCurrentWorkspace();
    }
  }, [workspaceId, setCurrentWorkspace, clearCurrentWorkspace]);

  const { data: projects } = useFetchProjectsInCurrentWorkspace(
    workspaceIdentifier,
    page
  );
  const { data: members } = useFetchMembersInWorkspace(workspaceIdentifier);

  if (workspaceIdentifier) {
    return (
      <div className="px-8 lg:px-32">
        <div className="flex items-center gap-4 mb-4">
          <span className="p-2 bg-primary/10 text-primary rounded-md">
            <FolderClosed className="size-4" />
          </span>
          <p className="text-lg font-semibold">
            {currentWorkspaceName || "Workspace"}
          </p>
        </div>
        <p className="text-md mb-4">
          Create your own projects and add new memembers to your workspace to
          stay organized and productive.
        </p>
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          <ProjectCardCreate />
          <WorkspaceMemeberCardCreate />
        </div>
        <div className="flex items-center gap-4 mt-16 mb-6">
          <span className="p-2 bg-primary/10 text-primary rounded-md">
            <Users className="size-4" />
          </span>
          <p className="text-lg font-semibold">Members in workspace</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {members?.data.map((member, index) => (
            <WorkspaceMemberCard
              key={index}
              workspaceMemberRole={member.role}
              member={member.userInformation}
            />
          ))}
        </div>
        <div className="flex items-center gap-4 mt-16 mb-6">
          <span className="p-2 bg-primary/10 text-primary rounded-md">
            <FileSpreadsheet className="size-4" />
          </span>
          <p className="text-lg font-semibold">Your all projects</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {projects?.data.items.map((project) => (
            <ProjectCard
              key={project.id}
              workspaceId={workspaceIdentifier}
              project={project}
            />
          ))}
        </div>
        <div className="mt-12">
          <PaginationUI
            page={page}
            totalPages={projects?.data.meta.totalPages || 1}
            setPage={setPage}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 lg:px-32">
      <div>
        <p className="text-md mb-4">Create your own workspaces.</p>
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4 mb-16">
          <WorkspaceCardCreate />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
