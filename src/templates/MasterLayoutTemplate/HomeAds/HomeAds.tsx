import React, { useEffect, useState } from "react";
import { PORTAL_URLS } from "../../../services/apiEndpoints";
import { axiosInstance } from "../../../services/axiosInstance";
import { Box, Typography } from "@mui/material";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ROOM_DETAILS_PATH } from "../../../services/paths";
import { Navigate } from "react-router-dom";
import ImageCard from "./ImageCard";

export default function HomeAds() {
  const [adsData, setAdsData] = useState<[]>([]);

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
      <Box mt={8}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography color="#152C5B" variant="h5" fontWeight={600}>
            Houses with beauty backyard
          </Typography>
          {/* <MUILink 
            underline="none"
            sx={{ textDecoration: "none", color: "red", fontWeight: 500 }}
            component={RouterLink}
            to="/rooms"
          >
            more
          </MUILink> */}
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
                  image={room.images?.[0]}
                  title={""}
                  price={room.price}
                  isFirst={false}
                  gridStyles={{ width: "100%", height: 250 }}
                  // onClick={() => Navigate(`${ROOM_DETAILS_PATH}/${room._id}`)}
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
