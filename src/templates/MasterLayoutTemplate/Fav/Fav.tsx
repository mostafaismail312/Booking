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
import defaultImage from "../../../assets/images/defaultroom.png";
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
    
  }, []);
 
  return (
    <>
      <Box sx={{ width: "85%", margin: "auto" }}>
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
     <Box sx={{ width: "85%", margin: "auto" }}>
            <Grid
          // container
           sx={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    padding: "10px",
    overflow: "visible"
  }}
          spacing={{ xs: 2, md: 3 }}
        >
          {favList.map((room) => (
            <Grid  key={room._id} room={room} >
              <ImageCard
                onClick={() => navigate(`roomsexplore/${room._id}`)}
                roomId={room._id}
               image={room.images?.[0] || defaultImage}
                title={room.roomNumber}
                price={room.price}
                isFirst={false}
                gridStyles={{ width: "100%", height: 220 }}
                isFavorite={favoriteIds.includes(room._id)}
                onToggleFavorite={(id) => {
                  if (favoriteIds.includes(id)) {
                    deleteFromFavs(id);
                  } else {
                    addToFavs(id);
                  }
                }}
              />
            </Grid>
          ))}
        </Grid>
     </Box>

    </>
  );
}
