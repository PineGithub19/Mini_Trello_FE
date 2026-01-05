import { IMAGES } from "@/lib/images";
import type { Project } from "@/types/project";

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="w-full rounded-lg overflow-hidden shadow-md hover:cursor-pointer">
      <div className="relative">
        <img
          className="object-cover w-full h-32"
          src={project.background || IMAGES.FALLBACK}
          alt="default_workspace_background"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity duration-300" />
      </div>
      <div className="bg-card p-2">
        <p>{project.name}</p>
      </div>
    </div>
  );
};

export default ProjectCard;
