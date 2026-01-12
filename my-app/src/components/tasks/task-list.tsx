import useProjectStore from "@/store/project-store";
import TaskListCreate from "./task-list-create";
import { useFetchTaskListsInProject } from "@/hooks/list-hooks";
import TaskListItem from "./task-list-item";

const TaskList = () => {
  const currentProjectId = useProjectStore((state) => state.currentProjectId);
  const { data: taskLists } = useFetchTaskListsInProject(
    currentProjectId || ""
  );

  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="flex items-start gap-4 min-w-max pb-2">
        {taskLists?.data.map((taskList) => (
          <TaskListItem
            key={taskList.id}
            listTitle={taskList.title}
            listId={taskList.id}
            projectId={currentProjectId || ""}
          />
        ))}
        <div className="w-64 bg-muted rounded-md p-2">
          <TaskListCreate />
        </div>
      </div>
    </div>
  );
};

export default TaskList;
