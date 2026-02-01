import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Add } from "@mui/icons-material";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { axiosInstance } from "../../../../services/axiosInstance";
import { ADMIN_URLS } from "../../../../services/apiEndpoints";
import SectionTitle from "../../../../shared/SectionTitle/SectionTitle";

/* ===== Types (based on your API response) ===== */
type FacilityObj = { _id: string; name: string };
type CreatedByObj = { _id: string; userName: string };

type Room = {
  _id: string;
  roomNumber: string;
  price: number;
  capacity: number;
  discount?: number;
  facilities: (string | FacilityObj)[];
  createdBy: string | CreatedByObj;
  images: string[];
};

type Ad = {
  _id: string;
  isActive: boolean;
  room: Room;
  createdBy: CreatedByObj;
  createdAt: string;
  updatedAt: string;
};

export default function AdsList() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* ===== Menu ===== */
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const menuOpen = Boolean(anchorEl);


  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteAd, setDeleteAd] = useState<Ad | null>(null);


  const facilitiesText = (facilities: Room["facilities"]) => {
    if (!Array.isArray(facilities) || facilities.length === 0) return "-";
    const names = facilities
      .map((f) => (typeof f === "string" ? null : f?.name))
      .filter(Boolean) as string[];
    return names.length ? names.join(", ") : "-";
  };

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(ADMIN_URLS.ADS.GET_ALL_ADS, {
          params: { page: page + 1, size },
          headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
        });

        const adsData = res.data?.data?.ads ?? [];
        const safeAds = Array.isArray(adsData) ? adsData : [];
        setAds(safeAds);
        setTotalCount(res.data?.data?.totalCount ?? safeAds.length);
      } catch (error) {
        console.error(error);
        setAds([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [page, size]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, ad: Ad) => {
    setAnchorEl(event.currentTarget);
    setSelectedAd(ad);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  const handleView = () => {
    if (!selectedAd) return;
    setOpenView(true);
    setAnchorEl(null);
  };

  const handleEdit = () => {
    if (!selectedAd) return;
    navigate(`/dashboard/editads/${selectedAd.room._id}`);
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    if (!selectedAd) return;
    setDeleteAd(selectedAd);
    setOpenDelete(true);
    setAnchorEl(null);
  };

  const confirmDelete = async () => {
    if (!deleteAd) return;

    try {
     
      await axiosInstance.delete(ADMIN_URLS.ROOM.DELETE_ROOM(deleteAd.room._id));

      setAds((prev) => prev.filter((a) => a._id !== deleteAd._id));
      setOpenDelete(false);
      setDeleteAd(null);
      toast.success("Deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete");
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          my: 2,
        }}
      >
        <SectionTitle title="ADs Table Details" />
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          onClick={() => navigate("/dashboard/createads")}
          sx={{
            textTransform: "none",
            borderRadius: "10px",
            backgroundColor: "#3F5FFF",
            px: 2.2,
            "&:hover": { backgroundColor: "#2d44d2" },
          }}
        >
          Add New Ads
        </Button>
      </Box>

      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: 3,
          boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
          pb: 7,
        }}
      >
        <TableContainer sx={{ width: "100%" }}>
          <Table
            stickyHeader
            sx={{
              borderCollapse: "separate",
              borderSpacing: "0px 10px", 
              px: 1,
            }}
          >
            <TableHead>
              <TableRow>
                {["room Name", "Price", "Discount", "Capacity", "Active", ""].map((label, idx) => (
                  <TableCell
                    key={label}
                    sx={{
                      bgcolor: "#e9edf3",
                      fontWeight: 700,
                      color: "#2b2f38",
                      borderBottom: "none",
                      py: 2,
                      ...(idx === 0 && {
                        borderTopLeftRadius: 14,
                        borderBottomLeftRadius: 14,
                      }),
                      ...(idx === 5 && {
                        borderTopRightRadius: 14,
                        borderBottomRightRadius: 14,
                      }),
                    }}
                  >
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ borderBottom: "none", py: 3 }}
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : ads.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ borderBottom: "none", py: 3 }}
                  >
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                ads.map((ad, index) => {
                  const isEven = index % 2 === 0;

                  return (
                    <TableRow
                      key={ad._id}
                      hover
                      sx={{
                        "& td": {
                          borderBottom: "none",
                          py: 2.2,
                          bgcolor: isEven ? "#ffffff" : "#f7f8fa",
                        },
                        "& td:first-of-type": {
                          borderTopLeftRadius: 12,
                          borderBottomLeftRadius: 12,
                        },
                        "& td:last-of-type": {
                          borderTopRightRadius: 12,
                          borderBottomRightRadius: 12,
                        },
                      }}
                    >
                      <TableCell sx={{ color: "#2b2f38", fontWeight: 500 }}>
                        {ad.room?.roomNumber ?? "-"}
                      </TableCell>

                      <TableCell sx={{ color: "#2b2f38", fontWeight: 500 }}>
                        {ad.room?.price ?? "-"}
                      </TableCell>

                      <TableCell sx={{ color: "#6b7280" }}>
                        {ad.room?.discount ?? "-"}
                      </TableCell>

                      <TableCell sx={{ color: "#6b7280" }}>
                        {ad.room?.capacity ?? "-"}
                      </TableCell>

                      <TableCell sx={{ color: "#2b2f38", fontWeight: 500 }}>
                        {ad.isActive ? "Yes" : "NO"}
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, ad)}
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 2,
                            bgcolor: "transparent",
                          }}
                        >
                          <MoreHorizIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

      
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: 3,
              mt: 1,
              minWidth: 170,
              boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
              overflow: "visible",
              "&:before": {
                content: '""',
                position: "absolute",
                top: 0,
                right: 18,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
              },
            },
          }}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleView} sx={{ py: 1.2 }}>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="View" />
          </MenuItem>

          <MenuItem onClick={handleEdit} sx={{ py: 1.2 }}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Edit" />
          </MenuItem>

          <MenuItem onClick={handleDeleteClick} sx={{ py: 1.2, color: "error.main" }}>
            <ListItemIcon sx={{ color: "error.main" }}>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Delete" />
          </MenuItem>
        </Menu>

      
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={totalCount}
          rowsPerPage={size}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setSize(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "background.paper",
            zIndex: 1300,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        />

        {/* ===== View Modal ===== */}
        <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Room Details</DialogTitle>
          <DialogContent dividers>
            {selectedAd?.room ? (
              <Stack spacing={1.5}>
                <Typography>
                  <b>Room Number:</b> {selectedAd.room.roomNumber}
                </Typography>
                <Typography>
                  <b>Price:</b> {selectedAd.room.price}
                </Typography>
                <Typography>
                  <b>Capacity:</b> {selectedAd.room.capacity}
                </Typography>
                <Typography>
                  <b>Discount:</b> {selectedAd.room.discount ?? 0}%
                </Typography>
                <Typography>
                  <b>Facilities:</b> {facilitiesText(selectedAd.room.facilities)}
                </Typography>

                {selectedAd.room.images?.length > 0 &&
                  selectedAd.room.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`room-${idx}`}
                      style={{ width: "100%", borderRadius: 10, objectFit: "cover" }}
                    />
                  ))}
              </Stack>
            ) : (
              <Typography>Loading...</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenView(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* ===== Delete Modal ===== */}
        <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
          <DialogTitle align="center">
            <DeleteOutlineIcon color="error" sx={{ fontSize: 50 }} />
          </DialogTitle>
          <DialogContent>
            <Typography align="center">
              Are you sure you want to delete: <b>{deleteAd?.room?.roomNumber ?? "-"}</b> ?
            </Typography>
            <Typography align="center" color="text.secondary">
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
            <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
            <Button color="error" variant="contained" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
}
