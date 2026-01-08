import type { Project } from "@/types/project";
import DashboardHeader from "../dashboard/dashboard-header";

const TaskPage = ({ project }: { project: Project }) => {
  return (
    <div className="flex flex-col gap-6 mb-16 lg:gap-8">
      <div>
        <DashboardHeader />
        <div className="flex items-center justify-between">
          <p>{project.name}</p>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
