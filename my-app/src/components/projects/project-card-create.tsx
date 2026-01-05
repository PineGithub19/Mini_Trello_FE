import ProjectCreatePopup from "./project-create-popup";

const ProjectCardCreate = () => {
  return (
    <div className="w-full h-32 rounded-lg overflow-hidden shadow-md hover:cursor-pointer">
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <ProjectCreatePopup
          trigger={
            <span className="h-full w-full text-muted-foreground">
              Create New Project
            </span>
          }
        />
      </div>
    </div>
  );
};

export default ProjectCardCreate;
