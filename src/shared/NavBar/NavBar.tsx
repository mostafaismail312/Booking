import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Drawer,
  List,
  ListItemText,
  ListItemButton,
  useMediaQuery,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import logoMain from "/color-logo-Ci_5FMX-.svg";
// import { useFavorite } from "@/store/AuthContext/FavoriteContext";
import { Link as RouterLink, useNavigate } from "react-router-dom";
// import { Link as MUILink } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";
import Swal from "sweetalert2";
import { CircularProgress } from "@mui/material";
// import { FavoriteBorder } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useFavorite } from "../../context/FavoriteContext/FavoriteContext";
import { FavoriteBorder } from "@mui/icons-material";

const Navbar = () => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "mui-confirm-btn",
      cancelButton: "mui-cancel-btn",
    },
    buttonsStyling: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const { favoriteItemsCount, refreshFavorites } = useFavorite(); //  get count and refresh
  const { fullUserData, logOutUser, loginData } = useAuth();
  const navigate = useNavigate();

  const userName = fullUserData?.userName || "Guest";
  const userAvatar = fullUserData?.profileImage || "/images/default-avatar.jpg";

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleLogout = () => {
    logOutUser();
    window.location.reload(); // 🔄 Force a full refresh of the app
  };
  const handleLogoutBtn = () => {
    handleMenuClose();
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "Do you want to logout?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Logout!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          handleLogout();
        }
      });
  };

  useEffect(() => {
    refreshFavorites();
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  // ✅ Hover style for desktop nav links
  const navLinkSx = {
    textDecoration: "none",
    color: "#152C5B",
    fontWeight: 500,
    transition: "color .2s ease",
    "&:hover": {
      color: "#3252DF",
    },
  };

  // ✅ Hover style for drawer items
  const drawerItemSx = {
    "&:hover .MuiListItemText-primary": {
      color: "#3252DF",
    },
  };

  return (
    <>
      {isLoading ? (
        <Box
          height="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <CircularProgress
            size={80}
            thickness={5.5}
            sx={{ color: "#3252DF", mb: 2 }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#3252DF",
              letterSpacing: 1,
              fontFamily: "Segoe UI, Roboto, sans-serif",
            }}
          >
            Loading...
          </Typography>
        </Box>
      ) : (
        <Box
          px={{ xs: 2, sm: 4, md: 8, lg: 20 }}
          sx={{ borderBottom: "1px solid #E5E5E5" }}
        >
          <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
              {/* Logo */}
              <Box
                component={RouterLink}
                to="/"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                }}
              >
                <Box
                  component="img"
                  src={logoMain}
                  alt="Staycation Logo"
                  sx={{ height: 30 }}
                />
              </Box>

              {/* Desktop Nav Items */}
              {!isMobile && (
                <Box display="flex" alignItems="center" gap={3}>
                  {/* Home */}
                  <Typography
                    component={RouterLink}
                    to="/"
                    sx={{
                      ...navLinkSx,
                      color: "#3252DF", // keep Home blue by default
                    }}
                  >
                    Home
                  </Typography>


                  {/* Exlpore */}

                  <Typography
                    component={RouterLink}
                    to="/roomsexplore"
                    sx={{
                      textDecoration: "none",
                      color: "#152C5B",
                      fontWeight: 500,
                    }}
                  >

                    Explore
                  </Typography>

                  {/* Reviews */}
                  {localStorage.getItem("token") && loginData ? (
                    <Typography component={RouterLink} to="" sx={navLinkSx}>
                      Reviews
                    </Typography>
                  ) : (
                    <Button
                      variant="contained"
                      component={RouterLink}
                      to="/register"
                      sx={{
                        bgcolor: "#3252DF",
                        borderRadius: "6px",
                        textTransform: "none",
                        fontWeight: "100",
                        px: "25px",
                        "&:hover": { bgcolor: "#3252DF" },
                      }}
                    >
                      Regsiter
                    </Button>
                  )}

                  {/* Favorites */}
                  
                  {localStorage.getItem("token") && loginData ? (
                    <Badge badgeContent={favoriteItemsCount || 0} color="error">
                      <Typography variant="button">
                        {" "}
                        <Typography 
                          
                          sx={{
                            textDecoration: "none",
                            color: "#152C5B",
                            fontWeight: 500,
                          }}
                          component={RouterLink}
                          to="/fav-list"
                        >
                          <FavoriteBorder />
                        </Typography>{" "}
                      </Typography>
                    </Badge>
                  ) : (
                    <Button
                      variant="contained"
                      component={RouterLink}
                      to="/login"
                      sx={{
                        bgcolor: "#3252DF",
                        borderRadius: "6px",
                        textTransform: "none",
                        fontWeight: "50",
                        px: "25px",
                      }}
                    >
                      Login Now
                    </Button>
                  )}

                  {/* Avatar with Dropdown */}
                  {localStorage.getItem("token") && loginData ? (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <IconButton onClick={handleMenuOpen}>
                        <Avatar src={userAvatar} alt={userName} />
                      </IconButton>

                      <Menu
                        anchorEl={menuAnchorEl}
                        open={Boolean(menuAnchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        PaperProps={{
                          sx: {
                            py: 1,
                            minWidth: 200,
                            "& .MuiMenuItem-root": {
                              gap: 1,
                              color: "#152C5B",
                              fontWeight: 300,
                            },
                          },
                        }}
                      >
                        <MenuItem disabled>
                          <PersonIcon fontSize="small" />
                          Welcome: {userName}
                        </MenuItem>

                        <MenuItem
                          component={RouterLink}
                          to="/fav-list"
                          onClick={handleMenuClose}
                        >
                          <FavoriteIcon fontSize="small" />
                          My Favorites
                        </MenuItem>

                        <MenuItem
                          onClick={handleLogoutBtn}
                          sx={{ borderTop: "1px solid #E5E5E5" }}
                        >
                          <LogoutIcon fontSize="small" />
                          Logout
                        </MenuItem>
                      </Menu>
                    </Box>
                  ) : (
                    ""
                  )}
                </Box>
              )}

              {/* Mobile Menu Icon */}
              {isMobile && (
                <IconButton onClick={() => setDrawerOpen(true)}>
                  <MenuIcon />
                </IconButton>
              )}
            </Toolbar>
          </AppBar>

          {/* Mobile Drawer */}
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <Box width={250} p={2}>
              <List>
                <ListItemButton
                  component={RouterLink}
                  to="/"
                  onClick={() => setDrawerOpen(false)}
                  sx={drawerItemSx}
                >
                  <ListItemText primary="Home" />
                </ListItemButton>

                <ListItemButton

                  component={RouterLink}
                  to="/roomsexplore"
                  onClick={() => setDrawerOpen(false)}

                  sx={drawerItemSx}
                  onClick={() => {
                    navigate("/roomsexplore");
                    setDrawerOpen(false);
                  }}

                >
                  <ListItemText primary="Explore" />
                </ListItemButton>

                <ListItemButton
                  component={RouterLink}
                  to=""
                  onClick={() => setDrawerOpen(false)}
                  sx={drawerItemSx}
                >
                  <ListItemText primary="Reviews" />
                </ListItemButton>

                <ListItemButton
                  component={RouterLink}
                  to="/fav-list"
                  onClick={() => setDrawerOpen(false)}
                  sx={drawerItemSx}
                >
                  <ListItemText primary="Favorites" />
                  {/* <Badge
                    badgeContent={favoriteItemsCount ?? 0}
                    color="error"
                    sx={{ ml: 1 }}
                  /> */}
                </ListItemButton>

                {/* Avatar + Logout */}
                <Box display="flex" alignItems="center" gap={1} mt={2} ml={1}>
                  <Avatar
                    src={userAvatar}
                    alt={userName}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box>
                    <Typography variant="body2">Welcome: {userName}</Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "blue",
                        cursor: "pointer",
                        "&:hover": { color: "#3252DF" },
                      }}
                      onClick={() => {
                        setDrawerOpen(false);
                        handleLogoutBtn();
                      }}
                    >
                      Logout
                    </Typography>
                  </Box>
                </Box>
              </List>
            </Box>
          </Drawer>
        </Box>
      )}
    </>
  );
};

export default Navbar;

