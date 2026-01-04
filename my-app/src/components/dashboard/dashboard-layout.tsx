import type { ReactNode } from "react";

import DashboardHeader from "./dashboard-header";
import DashboardSidebar from "./dashboard-sidebar";

type DashboardLayoutProps = {
  children?: ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <DashboardHeader />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.2fr)_minmax(0,0.8fr)] lg:gap-6">
        <DashboardSidebar />
        <section className="min-h-96 bg-background">{children}</section>
      </div>
    </div>
  );
};

export default DashboardLayout;
