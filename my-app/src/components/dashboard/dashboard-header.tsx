import { KanbanSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/auth-hooks";
import { useNavigate } from "react-router-dom";
import { useFetchUserProfile } from "@/hooks/user-hooks";
import DashboardSearch from "./dashboard-search";
import { extractInitial } from "@/lib/utils";
import { useTheme } from "../../store/providers/theme-provider";
import Notifications from "../notifications/notifications";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const { mutate, isPending } = useLogout();
  const { data } = useFetchUserProfile();

  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        navigate("/auth/sign-in");
      },
    });
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const handleGoToProfile = () => {
    navigate("/profile");
  };

  const handleToggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <header className="grid gap-4 bg-card p-4 shadow-sm md:grid-cols-[auto_1fr_auto] md:items-center md:gap-6">
      <div
        className="flex items-center gap-3 hover:cursor-pointer"
        onClick={handleGoToDashboard}
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <KanbanSquare className="size-4" />
        </span>
        <span className="text-md font-semibold tracking-tight">MiniTrello</span>
      </div>

      <div className="w-full flex items-center justify-center">
        <DashboardSearch />
      </div>

      <div className="flex items-center gap-4">
        <Notifications />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              className="rounded-full p-0"
              aria-label="Open user menu"
            >
              <Avatar className="size-10">
                <AvatarImage
                  src={data?.data.avatar || undefined}
                  alt="User avatar"
                />
                <AvatarFallback>
                  {extractInitial(data?.data.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <p className="text-muted-foreground text-sm px-2 py-2">
              {data?.data.name} | {data?.data.email}
            </p>
            <DropdownMenuItem onClick={handleGoToProfile}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleToggleTheme}>
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              {isPending ? "Logging out..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
