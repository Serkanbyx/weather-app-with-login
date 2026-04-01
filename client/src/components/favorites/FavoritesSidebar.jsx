import { useState, useEffect, useCallback } from "react";
import { favoritesAPI } from "../../services/api";

/* ─── Custom hook: favorites state management ─── */
export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data } = await favoritesAPI.getFavorites();
        setFavorites(data.favorites || []);
      } catch {
        setFavorites([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const addFavorite = useCallback(async (city) => {
    try {
      await favoritesAPI.addFavorite(city);
      setFavorites((prev) => (prev.includes(city) ? prev : [...prev, city]));
    } catch {
      /* silent — avoids breaking the UX on duplicate or network hiccup */
    }
  }, []);

  const removeFavorite = useCallback(async (city) => {
    try {
      await favoritesAPI.removeFavorite(city);
      setFavorites((prev) => prev.filter((fav) => fav !== city));
    } catch {
      /* silent */
    }
  }, []);

  const isFavorite = useCallback(
    (city) => favorites.includes(city),
    [favorites],
  );

  return { favorites, isLoading, addFavorite, removeFavorite, isFavorite };
}

/* ─── Presentational component ───
   variant="sidebar"  → desktop right-side panel (hidden on mobile)
   variant="mobile"   → collapsible chips (hidden on desktop)        */
function FavoritesSidebar({ favorites, isLoading, onCitySelect, onRemove, variant = "sidebar" }) {
  const [isOpen, setIsOpen] = useState(false);

  if (variant === "mobile") {
    return (
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <HeartIcon className="w-4 h-4 text-red-500" />
          Favorites ({favorites.length})
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="mt-2">
            <FavoritesList
              favorites={favorites}
              isLoading={isLoading}
              onCitySelect={onCitySelect}
              onRemove={onRemove}
              variant="chips"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 bg-white rounded-2xl shadow-md p-5 h-fit sticky top-24 self-start">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <HeartIcon className="w-5 h-5 text-red-500" />
        Favorites
      </h3>
      <FavoritesList
        favorites={favorites}
        isLoading={isLoading}
        onCitySelect={onCitySelect}
        onRemove={onRemove}
        variant="list"
      />
    </aside>
  );
}

/* ─── Shared sub-components ─── */

function FavoritesList({ favorites, isLoading, onCitySelect, onRemove, variant }) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-6">
        No favorites yet. Search for a city and add it!
      </p>
    );
  }

  if (variant === "chips") {
    return (
      <div className="flex flex-wrap gap-2">
        {favorites.map((city) => (
          <span
            key={city}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-medium"
          >
            <button
              onClick={() => onCitySelect(city)}
              className="hover:underline cursor-pointer"
            >
              {city}
            </button>
            <button
              onClick={() => onRemove(city)}
              className="ml-0.5 p-0.5 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors cursor-pointer"
              aria-label={`Remove ${city}`}
            >
              <CloseIcon className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {favorites.map((city) => (
        <li key={city} className="group flex items-center gap-2">
          <button
            onClick={() => onCitySelect(city)}
            className="flex-1 text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 transition-colors truncate cursor-pointer"
          >
            {city}
          </button>
          <button
            onClick={() => onRemove(city)}
            className="opacity-0 group-hover:opacity-100 shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
            aria-label={`Remove ${city}`}
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}

function HeartIcon({ className }) {
  return (
    <svg className={`fill-current ${className}`} viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function CloseIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

export default FavoritesSidebar;
