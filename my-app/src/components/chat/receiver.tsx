import { extractInitial } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ChatReceiver = ({
  message,
  userInformation,
}: {
  message: string;
  userInformation?: { name: string; email: string; avatar: string };
}) => {
  return (
    <div className="flex flex-row-reverse items-end gap-2 mt-2">
      <div className="relative bg-card-foreground text-background rounded-tl-lg rounded-tr-lg rounded-br-lg p-2">
        {message}
        {userInformation && (
          <p className="absolute -top-5 left-0 text-xs text-muted-foreground">
            {userInformation.name}
          </p>
        )}
      </div>
      {userInformation && (
        <Avatar className="size-6">
          <AvatarImage
            src={userInformation.avatar || undefined}
            alt="User avatar"
          />
          <AvatarFallback>
            {extractInitial(userInformation.name)}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatReceiver;
