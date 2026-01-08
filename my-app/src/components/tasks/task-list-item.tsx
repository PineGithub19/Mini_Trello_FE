import TaskCreate from "./task-create";

const TaskListItem = ({
  listTitle,
  listId,
}: {
  listTitle: string;
  listId: string;
}) => {
  return (
    <div className="w-64 bg-muted rounded-md px-4 py-2">
      <p className="font-semibold mb-2">{listTitle}</p>
      <TaskCreate listId={listId} />
    </div>
  );
};

export default TaskListItem;
