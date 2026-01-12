import DashboardHeader from "../dashboard/dashboard-header";
import { useLocation, useParams } from "react-router-dom";
import { useFetchProjectById } from "@/hooks/project-hooks";
import { useFetchMembersInWorkspace } from "@/hooks/workspace-member-hooks";
import useProjectStore from "@/store/project-store";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Button } from "../ui/button";
import { IMAGES } from "@/lib/images";
import TaskList from "../tasks/task-list";
import { extractInitial } from "@/lib/utils";

const ProjectPage = () => {
  const { projectId } = useParams<{ projectId?: string }>();
  const state = useLocation();
  const workspaceId = state?.state?.workspaceId as string | undefined;

  const setCurrentWorkspace = useProjectStore(
    (state) => state.setCurrentWorkspace
  );
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
  const clearCurrentProject = useProjectStore(
    (state) => state.clearCurrentProject
  );

  const { data: members } = useFetchMembersInWorkspace(workspaceId || "");

  const { data: project } = useFetchProjectById(projectId || "");
  const projectName = project?.data.name ?? "Project";
  const projectBackground = project?.data.background || IMAGES.FALLBACK;

  useEffect(() => {
    if (workspaceId) {
      setCurrentWorkspace(workspaceId);
      setCurrentProject(projectId || "");
    } else {
      clearCurrentProject();
    }
  }, [
    workspaceId,
    projectId,
    setCurrentWorkspace,
    setCurrentProject,
    clearCurrentProject,
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <section className="relative flex-1 overflow-hidden">
        <img
          src={projectBackground}
          alt={`${projectName} background`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="relative flex h-full flex-col justify-between">
          <header className=" bg-background/60 px-6 py-2 shadow-lg backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <p className="text-md font-semibold tracking-tight">
                  {projectName}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
                  {members?.data.map((member) => (
                    <Tooltip key={member.id}>
                      <TooltipTrigger>
                        <Avatar className="size-8 ring-2 ring-background">
                          <AvatarImage
                            src={member.userInformation.avatar || undefined}
                          />
                          <AvatarFallback>
                            {extractInitial(member.userInformation.name)}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{member.userInformation.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full"
                    >
                      <Ellipsis className="size-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem>Project Details</DropdownMenuItem>
                    <DropdownMenuItem>Member Management</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          <div className="mt-4 ml-6">
            <TaskList />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectPage;
