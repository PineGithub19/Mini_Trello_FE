import { Outlet } from "react-router-dom";

const CommonLayout = () => {
  return (
    <div className="common-layout">
      <header className="header">
        <h1>My Application</h1>
      </header>
      <main className="content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>&copy; 2024 My Application</p>
      </footer>
    </div>
  );
};

export default CommonLayout;
