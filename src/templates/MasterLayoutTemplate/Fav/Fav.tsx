import {
  Breadcrumbs,
  Typography,
  Link as MUILink,
  Box,
  Grid,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import ImageCard from "../HomeAds/ImageCard";
import { axiosInstance } from "../../../services/axiosInstance";
import { MAIN_PATH } from "../../../services/paths";
import { FAV_LIST_PATH } from "./../../../services/paths";
import { useFavorite } from "../../../context/FavoriteContext/FavoriteContext";
import { useEffect } from "react";

export default function Fav() {
  const navigate = useNavigate();
  const {
    favList,
    favoriteIds,
    loading,
    getFavsList,
    addToFavs,
    deleteFromFavs,
    refreshFavorites,
  } = useFavorite();

  useEffect(() => {
    getFavsList();
    console.log("hh" + favList);
    
  }, []);

  return (
    <>
      <Box sx={{ width: "80%", margin: "auto" }}>
        <Breadcrumbs sx={{ fontWeight: "500", mt: 2 }} aria-label="breadcrumb">
          <MUILink
            underline="none"
            color="#B0B0B0"
            component={RouterLink}
            to="/"
          >
            Home
          </MUILink>
          <Typography sx={{ color: "#152C5B", fontWeight: "500" }}>
            Favorites
          </Typography>
        </Breadcrumbs>

        {/* Page Heading */}
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            color: "#152C5B",
            mt: "20px",
            fontWeight: "bold",
          }}
        >
          Your Favorites
        </Typography>
      </Box>
      <Box sx={{ width: "80%", margin: "auto" }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {favList.map((room) => (
            <Box key={room._id}>
              <ImageCard
                // onClick={() => navigate(`${ROOM_DETAILS_PATH}/${room._id}`)}
                roomId={room._id}
                image={room.images?.[0]}
                title={room.roomNumber}
                price={room.price}
                isFirst={false}
                gridStyles={{ width: "100%", height: 250 }}
                // isFavorite={favoriteIds.includes(room._id)}
                // onToggleFavorite={(id) => {
                //   if (favoriteIds.includes(id)) {
                //     deleteFromFavs(id);
                //   } else {
                //     addToFavs(id);
                //   }
                // }}
              />
            </Box>
          ))}
        </Grid>
      </Box>
    </>
  );
}
