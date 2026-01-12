import TaskCreate from "./task-create";
import TaskListItemTitle from "./task-list-item-title";

const TaskListItem = ({
  listTitle,
  listId,
}: {
  listTitle: string;
  listId: string;
}) => {
  return (
    <div className="w-64 bg-muted rounded-md px-4 py-2">
      <TaskListItemTitle listTitle={listTitle} listId={listId} />
      <TaskCreate listId={listId} />
    </div>
  );
};

export default TaskListItem;
