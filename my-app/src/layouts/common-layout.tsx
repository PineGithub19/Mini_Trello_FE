import { Outlet } from "react-router-dom";

const CommonLayout = () => {
  return (
    <div className="min-h-screen w-full bg-background">
      <main className="mx-auto flex min-h-screen w-full flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default CommonLayout;
