import React, { useEffect, useState } from "react";
import { PORTAL_URLS } from "../../../services/apiEndpoints";
import { axiosInstance } from "../../../services/axiosInstance";
import { Box, Typography } from "@mui/material";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ROOM_DETAILS_PATH } from "../../../services/paths";
import { Navigate, useNavigate } from "react-router-dom";
import ImageCard from "./ImageCard";
import { useFavorite } from "../../../context/FavoriteContext/FavoriteContext";
import toast from "react-hot-toast";
import defaultImage from "../../../assets/images/bghvd1mamgpjnewgd2rt.png";
import defaultImage1 from "../../../assets/images/hv3kpulmpyzb2mgtsx85.png";
import defaultImage2 from "../../../assets/images/upegcd2svrx5neo5kvri.png"


export default function HomeAds() {
  const [adsData, setAdsData] = useState<[]>([]);
  const Navigate = useNavigate();
  const { refreshFavorites } = useFavorite();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  /* ========== get all favs to render the favlist comp ==========  */

  const getFavoriteRooms = async () => {
    try {
      const response = await axiosInstance.get(
        PORTAL_URLS.ROOMS.GET_FAVORITE_ROOMS,
      );
      const rooms = response.data.data.favoriteRooms?.[0]?.rooms || [];
      const ids = rooms.map((room: Room ) => room._id);
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
      setFavoriteIds((prev) => [...prev, roomId]); //  Update state
      toast.success(response?.data?.message || "Room added to favorites.");
      refreshFavorites();
      console.log(response);
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
          data: { roomId }, //  Send in body!
        },
      );

      setFavoriteIds((prev) => prev.filter((id) => id !== roomId)); // search by ID
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
      const allAds = response.data.data.ads || [];
      const sortedRecentAds = allAds
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 20);
      setAdsData(sortedRecentAds || []);
      console.log(response);
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };
  useEffect(() => {
    getAdsAll();
  }, []);
  return (
    <>
      {/* Houses with Beauty Backyard Section */}
      <Box
        mt={8}
        sx={{
          width: "90%",
          mx: "auto",
        }}
      >
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
                  onClick={() => Navigate(`/roomsexplore/${room._id}`)}
                   isFavorite={favoriteIds.includes(room._id)}
                  onToggleFavorite={(id) => {
                    if (favoriteIds.includes(id)) {
                      deleteFromFavs(id);
                    } else {
                      addToFavs(id);
                    }
                  }}
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

      {/* Houses with Beauty Backyard Section */}
      <Box
        mt={8}
        sx={{
          width: "90%",
          mx: "auto",
        }}
      >
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
                  onClick={() => Navigate(`/room-details/${room._id}`)}
                  isFavorite={favoriteIds.includes(room._id)}
                  onToggleFavorite={(id) => {
                    if (favoriteIds.includes(id)) {
                      deleteFromFavs(id);
                    } else {
                      addToFavs(id);
                    }
                  }}
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

      {/* Houses with Beauty Backyard Section */}
      <Box
        mt={8}
        sx={{
          width: "90%",
          mx: "auto",
        }}
      >
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
                  image={room.images?.[0] || defaultImage1 }
                  title={""}
                  price={room.price}
                  isFirst={false}
                  gridStyles={{ width: "100%", height: 250, display: "flex" }}
                  onClick={() => Navigate(`/roomsexplore/${room._id}`)}
                   isFavorite={favoriteIds.includes(room._id)}
                  onToggleFavorite={(id) => {
                    if (favoriteIds.includes(id)) {
                      deleteFromFavs(id);
                    } else {
                      addToFavs(id);
                    }
                  }}
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
