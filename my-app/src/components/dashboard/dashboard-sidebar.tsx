import { useState } from "react";
import { LayoutDashboard, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

const sidebarItems = [
  { label: "Dashboard", value: "dashboard", icon: LayoutDashboard },
  { label: "Profile", value: "profile", icon: UserRound },
];

const DashboardSidebar = () => {
  const [activeItem, setActiveItem] = useState("dashboard");

  return (
    <aside className="bg-card p-4">
      <nav aria-label="Dashboard navigation">
        <ul className="flex flex-col gap-2">
          {sidebarItems.map(({ label, value, icon: Icon }) => {
            const isActive = value === activeItem;

            return (
              <li key={value}>
                <button
                  type="button"
                  onClick={() => setActiveItem(value)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    isActive
                      ? "bg-highlight text-highlight-text"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="size-5" />
                    <span>{label}</span>
                  </span>
                  {isActive && (
                    <span className="size-2 rounded-full bg-highlight-text" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
