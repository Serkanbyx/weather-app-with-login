import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "./Header";

function Layout() {
  const { isLoading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex flex-col" role="main">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      <footer className="py-3 text-center text-xs text-gray-400 border-t border-gray-200">
        Created by{" "}
        <a
          href="https://serkanbayraktar.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600 transition-colors"
        >
          Serkanby
        </a>
        {" | "}
        <a
          href="https://github.com/Serkanbyx"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600 transition-colors"
        >
          Github
        </a>
      </footer>
    </div>
  );
}

export default Layout;
