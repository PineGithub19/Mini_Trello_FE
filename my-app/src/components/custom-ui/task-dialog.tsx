import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TaskDialogProps {
  triggerElement: React.ReactNode;
  cancelText: string;
  children?: React.ReactNode;
  className?: string;
  onAction?: () => void;
}

function TaskDialog({
  triggerElement,
  cancelText,
  children,
  className,
}: TaskDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{triggerElement}</AlertDialogTrigger>
      <AlertDialogContent className={`${className} w-full max-w-none`}>
        {children && <div className="py-4">{children}</div>}
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default TaskDialog;
