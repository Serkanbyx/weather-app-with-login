import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const { user, logout } = useAuth();

  const initial = user?.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-100 px-4 py-8 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Banner */}
          <div className="h-24 bg-linear-to-r from-blue-600 to-indigo-600" />

          {/* Avatar & Info */}
          <div className="flex flex-col items-center -mt-12 pb-6 px-8">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-blue-600 bg-blue-50">
              {initial}
            </div>
            <h1 className="text-xl font-bold text-gray-800 mt-3">{user?.name}</h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          {/* Stats & Actions */}
          <div className="px-8 pb-8 space-y-4">
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span className="text-sm text-gray-600">Favorite Cities</span>
              </div>
              <span className="text-sm font-semibold text-blue-600">
                {user?.favorites?.length || 0} / 10
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Weather
              </Link>
              <button
                onClick={logout}
                className="w-full px-4 py-2.5 rounded-xl border border-red-200 text-red-600 font-medium text-sm hover:bg-red-50 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
