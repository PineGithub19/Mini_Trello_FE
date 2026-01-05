import WorkspaceCreatePopup from "./workspace-create-popup";

const WorkspaceCardCreate = () => {
  return (
    <div className="w-full h-32 rounded-lg overflow-hidden shadow-md hover:cursor-pointer">
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <WorkspaceCreatePopup
          trigger={
            <span className="h-full w-full text-muted-foreground">
              Create New Workspace
            </span>
          }
        />
      </div>
    </div>
  );
};

export default WorkspaceCardCreate;
