import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { PORTAL_URLS } from "../../../services/apiEndpoints";
import { axiosInstance } from "../../../services/axiosInstance";
import ImageCard from "./ImageCard";
import { useFavorite } from "../../../context/FavoriteContext/FavoriteContext";

import defaultImage from "../../../assets/images/bghvd1mamgpjnewgd2rt.png";
import defaultImage1 from "../../../assets/images/hv3kpulmpyzb2mgtsx85.png";
import defaultImage2 from "../../../assets/images/upegcd2svrx5neo5kvri.png";

type Room = {
  _id: string;
  roomNumber?: string;
  price?: number;
  images?: string[];
};

type Ad = {
  _id?: string;
  room: Room;
  createdAt: string;
};

export default function HomeAds() {
  const [adsData, setAdsData] = useState<Ad[]>([]);
  const navigate = useNavigate();

  const { refreshFavorites } = useFavorite();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  /* ========== get all favs to render the favlist comp ========== */
  const getFavoriteRooms = async () => {
    try {
      const response = await axiosInstance.get(
        PORTAL_URLS.ROOMS.GET_FAVORITE_ROOMS,
      );

      const rooms: Room[] = response.data.data.favoriteRooms?.[0]?.rooms || [];
      const ids = rooms.map((room) => room._id);

      setFavoriteIds(ids);
    } catch (error) {
      console.error("Failed to fetch favorites", error);
    }
  };

  /* ========== add to favs========== */
  const addToFavs = async (roomId: string) => {
    try {
      const response = await axiosInstance.post(
        PORTAL_URLS.ROOMS.ADD_TO_FAVORITES,
        { roomId },
      );

      setFavoriteIds((prev) => (prev.includes(roomId) ? prev : [...prev, roomId]));
      toast.success(response?.data?.message || "Room added to favorites.");
      refreshFavorites();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to add to favorites.",
      );
      console.error(error);
    }
  };

  /* ========== remove from favs========== */
  const deleteFromFavs = async (roomId: string) => {
    try {
      const response = await axiosInstance.delete(
        PORTAL_URLS.ROOMS.REMOVE_FROM_FAVORITES(roomId),
        {
          data: { roomId }, // Send in body
        },
      );

      setFavoriteIds((prev) => prev.filter((id) => id !== roomId));
      toast.success(response?.data?.message || "Room removed from favorites.");
      refreshFavorites();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to remove from favorites.",
      );
      console.error(error);
    }
  };

  /* =============== get ads all  ========================== */
  const getAdsAll = async () => {
    try {
      const response = await axiosInstance.get(PORTAL_URLS.ADS.GET_ALL_ADS);

      const allAds: Ad[] = response.data.data.ads || [];
      const sortedRecentAds = allAds
        .sort(
          (a: Ad, b: Ad) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 20);

      setAdsData(sortedRecentAds || []);
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };

  useEffect(() => {
    getAdsAll();
    getFavoriteRooms(); // مهم عشان القلب يعكس الحالة من البداية
  }, []);

  const toggleFavorite = (roomId: string) => {
    if (favoriteIds.includes(roomId)) {
      deleteFromFavs(roomId);
    } else {
      addToFavs(roomId);
    }
  };

  return (
    <>
      {/* Houses with Beauty Backyard Section */}
      <Box mt={8} sx={{ width: "90%", mx: "auto" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography color="#152C5B" variant="h5" fontWeight={600}>
            Houses with beauty backyard
          </Typography>
        </Box>

        <Swiper
          spaceBetween={16}
          slidesPerView={4}
          autoplay={{ delay: 2000, disableOnInteraction: true }}
          modules={[Autoplay]}
          style={{ width: "100%" }}
          breakpoints={{
            0: { slidesPerView: 1 },
            600: { slidesPerView: 2 },
            960: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {[...adsData].reverse().map((ad) => {
            const room = ad.room;
            return (
              <SwiperSlide key={room._id}>
                <ImageCard
                  roomId={room._id}
                  image={room.images?.[0] || defaultImage}
                  title={""}
                  price={room.price}
                  isFirst={false}
                  gridStyles={{ width: "100%", height: 250, display: "flex" }}
                  onClick={() => navigate(`/roomsexplore/${room._id}`)}
                  isFavorite={favoriteIds.includes(room._id)}
                  onToggleFavorite={(id) => toggleFavorite(id)}
                />

                <Typography
                  color="#152C5B"
                  fontWeight={600}
                  fontSize={16}
                  mt={1}
                >
                  {room.roomNumber}
                </Typography>

                <Typography variant="body2" color="#C7C7C7">
                  item location
                </Typography>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Box>

      {/* Hotels with large living room */}
      <Box mt={8} sx={{ width: "90%", mx: "auto" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography color="#152C5B" variant="h5" fontWeight={600}>
            Hotels with large living room
          </Typography>
        </Box>

        <Swiper
          spaceBetween={16}
          slidesPerView={4}
          autoplay={{ delay: 2000, disableOnInteraction: true }}
          modules={[Autoplay]}
          style={{ width: "100%" }}
          breakpoints={{
            0: { slidesPerView: 1 },
            600: { slidesPerView: 2 },
            960: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {adsData.map((ad) => {
            const room = ad.room;
            return (
              <SwiperSlide key={room._id}>
                <ImageCard
                  roomId={room._id}
                  image={room.images?.[0] || defaultImage2}
                  title={""}
                  price={room.price}
                  isFirst={false}
                  gridStyles={{ width: "100%", height: 250, display: "flex" }}
                  onClick={() => navigate(`/room-details/${room._id}`)}
                  isFavorite={favoriteIds.includes(room._id)}
                  onToggleFavorite={(id) => toggleFavorite(id)}
                />

                <Typography
                  color="#152C5B"
                  fontWeight={600}
                  fontSize={16}
                  mt={1}
                >
                  {room.roomNumber}
                </Typography>

                <Typography variant="body2" color="#C7C7C7">
                  item location
                </Typography>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Box>

      {/* Houses with beauty backyard Section (second) */}
      <Box mt={8} sx={{ width: "90%", mx: "auto" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography color="#152C5B" variant="h5" fontWeight={600}>
            Houses with beauty backyard
          </Typography>
        </Box>

        <Swiper
          spaceBetween={16}
          slidesPerView={4}
          autoplay={{ delay: 2000, disableOnInteraction: true }}
          modules={[Autoplay]}
          style={{ width: "100%" }}
          breakpoints={{
            0: { slidesPerView: 1 },
            600: { slidesPerView: 2 },
            960: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {[...adsData].reverse().map((ad) => {
            const room = ad.room;
            return (
              <SwiperSlide key={room._id}>
                <ImageCard
                  roomId={room._id}
                  image={room.images?.[0] || defaultImage1}
                  title={""}
                  price={room.price}
                  isFirst={false}
                  gridStyles={{ width: "100%", height: 250, display: "flex" }}
                  onClick={() => navigate(`/roomsexplore/${room._id}`)}
                  isFavorite={favoriteIds.includes(room._id)}
                  onToggleFavorite={(id) => toggleFavorite(id)}
                />

                <Typography
                  color="#152C5B"
                  fontWeight={600}
                  fontSize={16}
                  mt={1}
                >
                  {room.roomNumber}
                </Typography>

                <Typography variant="body2" color="#C7C7C7">
                  item location
                </Typography>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Box>
    </>
  );
}

