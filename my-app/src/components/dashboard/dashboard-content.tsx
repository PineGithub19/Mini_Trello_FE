import useWorkspaceStore from "@/store/workspace-store";
import ProjectCard from "../projects/project-card";
import ProjectCardCreate from "../projects/project-card-create";
import WorkspaceCardCreate from "../workspace/workspace-card-create";
import { useFetchProjectsInCurrentWorkspace } from "@/hooks/project-hooks";
import { useState } from "react";
import PaginationUI from "../custom-ui/pagination-ui";
import { FolderClosed, FileSpreadsheet } from "lucide-react";

const DashboardContent = () => {
  const [page, setPage] = useState(1);

  const currentWorkspaceId = useWorkspaceStore(
    (state) => state.currentWorkspaceId
  );
  const currentWorkspaceName = useWorkspaceStore(
    (state) => state.currentWorkspaceName
  );

  const { data: projects } = useFetchProjectsInCurrentWorkspace(
    currentWorkspaceId || "",
    page
  );

  if (currentWorkspaceId) {
    return (
      <div className="px-8 lg:px-32">
        <div className="flex items-center gap-4 mb-4">
          <span className="p-2 bg-primary/10 text-primary rounded-md">
            <FolderClosed className="size-4" />
          </span>
          <p className="text-lg font-semibold">{currentWorkspaceName}</p>
        </div>
        <p className="text-md mb-4">
          Create your own projects to stay organized and productive.
        </p>
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          <ProjectCardCreate />
        </div>

        <div className="flex items-center gap-4 mt-16 mb-6">
          <span className="p-2 bg-primary/10 text-primary rounded-md">
            <FileSpreadsheet className="size-4" />
          </span>
          <p className="text-lg font-semibold">Your all projects</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
          {projects?.data.items.map((project) => (
            <ProjectCard key={project.id} project={project} />
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
