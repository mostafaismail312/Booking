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
  FormControl,
  InputLabel,
  Select,
  Switch,
  TextField,
  FormControlLabel,
  CircularProgress,
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

import { Controller, useForm } from "react-hook-form";

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
  // لو عندك discount على الـ Ad نفسه (مش على room) ضيفه هنا:
  // discount?: number;
};

/* ===== Forms ===== */
type AddAdForm = {
  room: string;
  discount: number;
  isActive: boolean;
};

type EditAdForm = {
  room: string;
  discount: number;
  isActive: boolean;
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

  /* ===== View / Delete ===== */
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteAd, setDeleteAd] = useState<Ad | null>(null);

  /* ===== Add / Edit Modals ===== */
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editAd, setEditAd] = useState<Ad | null>(null);

  /* ===== Rooms for select ===== */
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  /* ===== Add Form ===== */
  const {
    control: addControl,
    handleSubmit: handleAddSubmit,
    reset: resetAdd,
    formState: { isSubmitting: isAddSubmitting },
  } = useForm<AddAdForm>({
    defaultValues: {
      room: "",
      discount: 0,
      isActive: false,
    },
  });

  /* ===== Edit Form ===== */
  const {
    control: editControl,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { isSubmitting: isEditSubmitting },
  } = useForm<EditAdForm>({
    defaultValues: {
      room: "",
      discount: 0,
      isActive: false,
    },
  });

  const facilitiesText = (facilities: Room["facilities"]) => {
    if (!Array.isArray(facilities) || facilities.length === 0) return "-";
    const names = facilities
      .map((f) => (typeof f === "string" ? null : f?.name))
      .filter(Boolean) as string[];
    return names.length ? names.join(", ") : "-";
  };

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

  useEffect(() => {
    fetchAds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size]);

  const fetchRoomsForSelect = async () => {
    setLoadingRooms(true);
    try {
      // ✅ غيّر endpoint حسب عندك
      const res = await axiosInstance.get(ADMIN_URLS.ROOM.GET_ALL_ROOMS, {
        params: { page: 1, size: 500 },
      });

      const roomsData = res.data?.data?.rooms ?? [];
      setRooms(Array.isArray(roomsData) ? roomsData : []);
    } catch (e) {
      console.error(e);
      setRooms([]);
      toast.error("Failed to load rooms");
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, ad: Ad) => {
    setAnchorEl(event.currentTarget);
    setSelectedAd(ad);
  };

  const handleMenuClose = () => setAnchorEl(null);

  /* ===== View ===== */
  const handleView = () => {
    if (!selectedAd) return;
    setOpenView(true);
    setAnchorEl(null);
  };

  /* ===== Edit (Modal) ===== */
  const handleEdit = async () => {
    if (!selectedAd) return;

    setEditAd(selectedAd);
    setOpenEdit(true);
    setAnchorEl(null);

    if (rooms.length === 0) {
      await fetchRoomsForSelect();
    }

    // ⚠️ discount: انت عندك في الجدول بتعرض ad.room.discount
    // لو discount الحقيقي موجود على ad نفسه، بدّل السطر ده لـ: (selectedAd as any).discount
    resetEdit({
      room: selectedAd.room?._id ?? "",
      discount: Number(selectedAd.room?.discount ?? 0),
      isActive: Boolean(selectedAd.isActive),
    });
  };

  const closeEditModal = () => {
    setOpenEdit(false);
    setEditAd(null);
    resetEdit({ room: "", discount: 0, isActive: false });
  };

  const onSubmitEdit = async (data: EditAdForm) => {
    if (!editAd) return;

    try {
      // ✅ غيّر endpoint حسب عندك
      await axiosInstance.put(ADMIN_URLS.ADS.UPDATE_AD(editAd._id), {
        room: data.room,
        discount: Number(data.discount) || 0,
        isActive: Boolean(data.isActive),
      });

      toast.success("Updated successfully");
      closeEditModal();
      await fetchAds();
    } catch (e) {
      console.error(e);
      toast.error("Failed to update");
    }
  };

  /* ===== Delete ===== */
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

  /* ===== Add (Modal) ===== */
  const openAddModal = async () => {
    setOpenAdd(true);
    resetAdd({ room: "", discount: 0, isActive: false });
    if (rooms.length === 0) await fetchRoomsForSelect();
  };

  const closeAddModal = () => {
    setOpenAdd(false);
    resetAdd({ room: "", discount: 0, isActive: false });
  };

  const onSubmitAdd = async (data: AddAdForm) => {
    try {
      // ✅ غيّر endpoint حسب عندك
      await axiosInstance.post(ADMIN_URLS.ADS.CREATE_AD, {
        room: data.room,
        discount: Number(data.discount) || 0,
        isActive: Boolean(data.isActive),
      });

      toast.success("Ad created successfully");
      closeAddModal();
      await fetchAds();
    } catch (e) {
      console.error(e);
      toast.error("Failed to create ad");
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
          onClick={openAddModal}
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
        <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
          <Table
            stickyHeader
            sx={{
              width: "100%",
              minWidth: 900,
              borderCollapse: "separate",
              borderSpacing: "0px 10px",
              px: 1,
            }}
          >
            <TableHead>
              <TableRow>
                {["room Name", "Price", "Discount", "Capacity", "Active", ""].map(
                  (label, idx) => (
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
                  )
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ borderBottom: "none", py: 3 }}>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : ads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ borderBottom: "none", py: 3 }}>
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

        {/* ===== Actions Menu ===== */}
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

        {/* ===== Pagination ===== */}
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

        {/* ===== Add New Ad Modal ===== */}
        <Dialog open={openAdd} onClose={closeAddModal} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Ad</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel id="add-room-label">Room</InputLabel>
                <Controller
                  name="room"
                  control={addControl}
                  rules={{ required: "Room is required" }}
                  render={({ field, fieldState }) => (
                    <Select
                      {...field}
                      labelId="add-room-label"
                      label="Room"
                      error={!!fieldState.error}
                      disabled={loadingRooms}
                    >
                      {loadingRooms ? (
                        <MenuItem value="">
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CircularProgress size={16} />
                            Loading rooms...
                          </Box>
                        </MenuItem>
                      ) : rooms.length === 0 ? (
                        <MenuItem value="">No rooms</MenuItem>
                      ) : (
                        rooms.map((r) => (
                          <MenuItem key={r._id} value={r._id}>
                            {r.roomNumber} — {r.price}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  )}
                />
              </FormControl>

              <Controller
                name="discount"
                control={addControl}
                rules={{
                  min: { value: 0, message: "Min is 0" },
                  max: { value: 100, message: "Max is 100" },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Discount (%)"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    inputProps={{ min: 0, max: 100 }}
                  />
                )}
              />

              <Controller
                name="isActive"
                control={addControl}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch checked={field.value} onChange={(_, v) => field.onChange(v)} />
                    }
                    label="Active"
                  />
                )}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeAddModal} disabled={isAddSubmitting}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddSubmit(onSubmitAdd)}
              disabled={isAddSubmitting}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                backgroundColor: "#3F5FFF",
                "&:hover": { backgroundColor: "#2d44d2" },
              }}
            >
              {isAddSubmitting ? "Saving..." : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* ===== Edit Ad Modal ===== */}
        <Dialog open={openEdit} onClose={closeEditModal} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Ad</DialogTitle>

          <DialogContent dividers>
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel id="edit-room-label">Room</InputLabel>
                <Controller
                  name="room"
                  control={editControl}
                  rules={{ required: "Room is required" }}
                  render={({ field, fieldState }) => (
                    <Select
                      {...field}
                      labelId="edit-room-label"
                      label="Room"
                      error={!!fieldState.error}
                      disabled={loadingRooms}
                    >
                      {loadingRooms ? (
                        <MenuItem value="">
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CircularProgress size={16} />
                            Loading rooms...
                          </Box>
                        </MenuItem>
                      ) : rooms.length === 0 ? (
                        <MenuItem value="">No rooms</MenuItem>
                      ) : (
                        rooms.map((r) => (
                          <MenuItem key={r._id} value={r._id}>
                            {r.roomNumber} — {r.price}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  )}
                />
              </FormControl>

              <Controller
                name="discount"
                control={editControl}
                rules={{
                  min: { value: 0, message: "Min is 0" },
                  max: { value: 100, message: "Max is 100" },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Discount (%)"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    inputProps={{ min: 0, max: 100 }}
                  />
                )}
              />

              <Controller
                name="isActive"
                control={editControl}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Switch checked={field.value} onChange={(_, v) => field.onChange(v)} />}
                    label="Active"
                  />
                )}
              />

              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "rgba(0,0,0,0.02)",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Current Room Preview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {editAd?.room?.roomNumber ?? "-"}
                </Typography>
              </Box>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={closeEditModal} disabled={isEditSubmitting}>
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleEditSubmit(onSubmitEdit)}
              disabled={isEditSubmitting}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                backgroundColor: "#3F5FFF",
                "&:hover": { backgroundColor: "#2d44d2" },
              }}
            >
              {isEditSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
}
