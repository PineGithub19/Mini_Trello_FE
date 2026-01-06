import WorkspaceAddMemberPopup from "./workspace-add-member-popup";

const WorkspaceMemeberCardCreate = () => {
  return (
    <div className="w-full h-32 rounded-lg overflow-hidden shadow-md hover:cursor-pointer">
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <WorkspaceAddMemberPopup
          trigger={
            <span className="h-full w-full text-muted-foreground">
              Add New Member
            </span>
          }
        />
      </div>
    </div>
  );
};

export default WorkspaceMemeberCardCreate;
