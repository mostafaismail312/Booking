// src/context/FavoriteContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { axiosInstance } from "../../services/axiosInstance";
import { PORTAL_URLS } from "../../services/apiEndpoints";

interface Room {
  _id: string;
  roomNumber: string;
  price: number;
  images: string[];
}

type FavoriteContextType = {
  favoriteItemsCount: number;
  favoriteIds: string[];
  favList: Room[];
  loading: boolean;
  refreshFavorites: () => void;
  getFavsList: () => void;
  addToFavs: (roomId: string) => void;
  deleteFromFavs: (roomId: string) => void;
};

const FavoriteContext = createContext<FavoriteContextType>({
  favoriteItemsCount: 0,
  favoriteIds: [],
  favList: [],
  loading: false,
  refreshFavorites: () => {},
  getFavsList: () => {},
  addToFavs: () => {},
  deleteFromFavs: () => {},
});

export const FavoriteProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [favoriteItemsCount, setFavoriteItemsCount] = useState(0);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favList, setFavList] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshFavorites = async () => {
    try {
      const res = await axiosInstance.get(PORTAL_URLS.ROOMS.GET_FAVORITE_ROOMS);
      setFavoriteItemsCount(
        res.data.data.favoriteRooms?.[0]?.rooms.length || 0,
      );
    } catch (error) {
      console.error("Failed to fetch favorites count", error);
    }
  };
  /* ========== get all ========== */

  const getFavsList = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        PORTAL_URLS.ROOMS.GET_FAVORITE_ROOMS,
      );
      const rooms = response.data.data.favoriteRooms?.[0]?.rooms || [];
      setFavList(rooms);
      

      setFavoriteIds(rooms.map((room: Room) => room._id));
    } catch (error) {
      console.error("Failed to fetch favorite rooms", error);
    } finally {
      setLoading(false);
    }
  };
  /* ========== add to favs ========== */

  const addToFavs = async (roomId: string) => {
    try {
      const response = await axiosInstance.post(
        PORTAL_URLS.ROOMS.ADD_TO_FAVORITES,
        { roomId },
      );

      // تحديث محلي فقط
      setFavoriteIds((prev) =>
        prev.includes(roomId) ? prev : [...prev, roomId],
      );

      toast.success(response?.data?.message || "Room added to favorites.");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to add to favorites.";

      toast.error(errorMessage);
      console.error(axiosError);
    }
  };

  /* ========== Delete from favs ========== */

  const deleteFromFavs = async (roomId: string) => {
    try {
      const response = await axiosInstance.delete(
        PORTAL_URLS.ROOMS.DELETE_FROM_FAVORITES(roomId),
      );

      setFavoriteIds((prev) => prev.filter((id) => id !== roomId));

      toast.success(response?.data?.message || "Removed from favorites.");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Failed to remove from favorites.";

      toast.error(errorMessage);
      console.error(axiosError);
    }
  };

  useEffect(() => {
    refreshFavorites();
  }, []);

  return (
    <FavoriteContext.Provider
      value={{
        favoriteItemsCount,
        favoriteIds,
        favList,
        loading,
        refreshFavorites,
        getFavsList,
        addToFavs,
        deleteFromFavs,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorite = () => useContext(FavoriteContext);
