import { useEffect, useMemo, useState } from "react";
import { LayoutDashboard } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import {
  useFetchColaboratedWorkspaces,
  useFetchWorkspaces,
} from "@/hooks/workspace-hooks";
import { Button } from "../ui/button";
import useWorkspaceStore from "@/store/workspace-store";

const sidebarItems = [
  { label: "Dashboard", value: "dashboard", icon: LayoutDashboard },
];

const DashboardSidebar = () => {
  const [page, setPage] = useState(1);
  const { data: workspaces } = useFetchWorkspaces(page);
  const { data: colaboratedWorkspaces } = useFetchColaboratedWorkspaces(page);

  const navigate = useNavigate();
  const { workspaceId } = useParams<{ workspaceId?: string }>();
  const activeItem = workspaceId ?? "dashboard";
  const setCurrentWorkspace = useWorkspaceStore(
    (state) => state.setCurrentWorkspace
  );
  const setCurrentWorkspaceName = useWorkspaceStore(
    (state) => state.setCurrentWorkspaceName
  );
  const setCurrentWorkspaceOwnerId = useWorkspaceStore(
    (state) => state.setCurrentWorkspaceOwnerId
  );
  const clearCurrentWorkspace = useWorkspaceStore(
    (state) => state.clearCurrentWorkspace
  );
  const currentWorkspaceId = useWorkspaceStore(
    (state) => state.currentWorkspaceId
  );
  const currentWorkspaceName = useWorkspaceStore(
    (state) => state.currentWorkspaceName
  );
  const currentWorkspaceOwnerId = useWorkspaceStore(
    (state) => state.currentWorkspaceOwnerId
  );

  const availableWorkspaces = useMemo(() => {
    return [
      ...(workspaces?.data.items ?? []),
      ...(colaboratedWorkspaces?.data.items ?? []),
    ];
  }, [workspaces?.data.items, colaboratedWorkspaces?.data.items]);

  useEffect(() => {
    if (!workspaceId) {
      if (currentWorkspaceId) {
        clearCurrentWorkspace();
      }
      return;
    }

    if (currentWorkspaceId !== workspaceId) {
      setCurrentWorkspace(workspaceId);
    }

    const matchedWorkspace = availableWorkspaces.find(
      (workspace) => workspace.id === workspaceId
    );

    if (matchedWorkspace) {
      if (currentWorkspaceName !== matchedWorkspace.name) {
        setCurrentWorkspaceName(matchedWorkspace.name);
      }
      if (currentWorkspaceOwnerId !== matchedWorkspace.ownerId) {
        setCurrentWorkspaceOwnerId(matchedWorkspace.ownerId);
      }
    }
  }, [
    workspaceId,
    currentWorkspaceId,
    currentWorkspaceName,
    currentWorkspaceOwnerId,
    availableWorkspaces,
    setCurrentWorkspace,
    setCurrentWorkspaceName,
    setCurrentWorkspaceOwnerId,
    clearCurrentWorkspace,
  ]);

  return (
    <aside className="bg-background px-4">
      <nav aria-label="Dashboard navigation">
        <ul className="flex flex-col gap-2">
          {sidebarItems.map(({ label, value, icon: Icon }) => {
            const isActive = value === activeItem;

            return (
              <li key={value}>
                <button
                  type="button"
                  onClick={() => {
                    clearCurrentWorkspace();
                    navigate("/dashboard");
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    isActive
                      ? "bg-highlight text-highlight-text"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="size-4" />
                    <span>{label}</span>
                  </span>
                  {isActive && (
                    <span className="size-2 rounded-full bg-highlight-text" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        <Separator className="my-4" />
        <p className="text-muted-foreground text-sm px-4 mb-4">My Workspace</p>
        <ul className="flex flex-col gap-2">
          {workspaces?.data.items.map((workspace) => {
            const isActive = workspace.id === activeItem;

            return (
              <li key={workspace.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (workspace.id !== currentWorkspaceId) {
                      setCurrentWorkspace(workspace.id);
                      setCurrentWorkspaceName(workspace.name);
                      setCurrentWorkspaceOwnerId(workspace.ownerId);
                    }
                    navigate(`/dashboard/workspaces/${workspace.id}`);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    isActive
                      ? "bg-highlight text-highlight-text"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className="size-6 flex items-center justify-center rounded-sm bg-primary/10 text-primary">
                      {workspace.name.charAt(0).toUpperCase()}
                    </span>
                    <span>{workspace.name}</span>
                  </span>
                  {workspace.id === activeItem && (
                    <span className="size-2 rounded-full bg-highlight-text" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        {workspaces?.data.meta.totalPages !== undefined &&
          workspaces?.data.meta.totalPages > 1 && (
            <Button
              variant="secondary"
              className="mx-[50%] my-4"
              onClick={() => setPage((prev) => prev + 1)}
            >
              Load More
            </Button>
          )}
        <Separator className="my-4" />
        <p className="text-muted-foreground text-sm px-4 mb-4">
          Colaborated Workspaces
        </p>
        <ul className="flex flex-col gap-2 mb-8">
          {colaboratedWorkspaces?.data.items.map((workspace) => {
            const isActive = workspace.id === activeItem;

            return (
              <li key={workspace.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (workspace.id !== currentWorkspaceId) {
                      setCurrentWorkspace(workspace.id);
                      setCurrentWorkspaceName(workspace.name);
                      setCurrentWorkspaceOwnerId(workspace.ownerId);
                    }
                    navigate(`/dashboard/workspaces/${workspace.id}`);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    isActive
                      ? "bg-highlight text-highlight-text"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className="size-6 flex items-center justify-center rounded-sm bg-primary/10 text-primary">
                      {workspace.name.charAt(0).toUpperCase()}
                    </span>
                    <span>{workspace.name}</span>
                  </span>
                  {workspace.id === activeItem && (
                    <span className="size-2 rounded-full bg-highlight-text" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
