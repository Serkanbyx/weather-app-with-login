import { Outlet } from "react-router-dom";
import Header from "./Header";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
