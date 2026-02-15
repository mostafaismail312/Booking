import React, { useEffect, useMemo, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { ADMIN_URLS, baseURL } from "../../../../services/apiEndpoints";
import axiosInstance from "../../../../services/axiosInstance";
import SectionTitle from "../../../../shared/SectionTitle/SectionTitle";

type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed" | string;

interface BookingUser {
  _id: string;
  userName: string;
  email?: string;
  phoneNumber?: string;
  country?: string;
  profileImage?: string;
}

interface BookingRoom {
  _id: string;
  roomNumber?: string;
  images?: string[];
}

interface Booking {
  _id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  user: BookingUser;
  room: BookingRoom;
}

interface Column {
  id: "roomNumber" | "price" | "startDate" | "endDate" | "userName" | "status" | "Action";
  label: string;
  minWidth: number;
  align?: "left" | "center" | "right";
}

function formatDate(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "2-digit", day: "2-digit" });
}

function money(n?: number) {
  if (n === null || n === undefined) return "-";
  return `${n}`;
}

function statusChipProps(status?: BookingStatus) {
  const s = (status || "").toLowerCase();
  if (s === "pending") return { label: "Pending", color: "warning" as const, variant: "outlined" as const };
  if (s === "confirmed") return { label: "Confirmed", color: "success" as const, variant: "outlined" as const };
  if (s === "cancelled") return { label: "Cancelled", color: "error" as const, variant: "outlined" as const };
  if (s === "completed") return { label: "Completed", color: "success" as const, variant: "filled" as const };
  return { label: status || "-", color: "default" as const, variant: "outlined" as const };
}

function normalizeUrl(maybePath?: string) {
  if (!maybePath) return "";
  if (maybePath.startsWith("http://") || maybePath.startsWith("https://")) return maybePath;

  const fixed = maybePath.replace("/admin/Booking", "/admin/booking");
  const slash = fixed.startsWith("/") ? "" : "/";
  return `${baseURL}${slash}${fixed}`;
}

export default function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);

  // View modal
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Delete confirm (MUI)
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const RAW_BOOKINGS_URL: string = (ADMIN_URLS as any)?.BOOKING?.GET_ALL_BOOKINGS;
  const BOOKINGS_URL = useMemo(() => {
    const u = normalizeUrl(RAW_BOOKINGS_URL);
    return u || `${baseURL}/admin/booking`;
  }, [RAW_BOOKINGS_URL]);

  const getDeleteUrl = (id: string) => {
    const delFn = (ADMIN_URLS as any)?.BOOKING?.DELETE_BOOKING;
    if (typeof delFn === "function") return delFn(id);

    const base = (ADMIN_URLS as any)?.BOOKING?.DELETE_BOOKING;
    if (typeof base === "string") return normalizeUrl(`${base}/${id}`);

    return `${BOOKINGS_URL}/${id}`;
  };

  const columns: Column[] = useMemo(
    () => [
      { id: "roomNumber", label: "Room Number", minWidth: 140 },
      { id: "price", label: "Price", minWidth: 110 },
      { id: "startDate", label: "Start Date", minWidth: 150 },
      { id: "endDate", label: "End Date", minWidth: 150 },
      { id: "userName", label: "User", minWidth: 140 },
      { id: "status", label: "Status", minWidth: 140 },
      { id: "Action", label: "", minWidth: 120, align: "right" },
    ],
    []
  );

  const openViewModal = (b: Booking) => {
    setSelectedBooking(b);
    setViewOpen(true);
  };

  const closeViewModal = () => {
    setViewOpen(false);
    setSelectedBooking(null);
  };

  const openDeleteModal = (b: Booking) => {
    setDeleteError("");
    setDeleteTarget(b);
    setDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteOpen(false);
    setDeleteTarget(null);
    setDeleteError("");
  };

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(BOOKINGS_URL, {
        params: { page: page + 1, size },
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });

      const api = (res as any)?.data ?? res;

      if (typeof api === "string" && api.includes("<!doctype html")) {
        console.error("API returned HTML (not JSON). Check URL/baseURL.", { BOOKINGS_URL });
        setBookings([]);
        setTotalCount(0);
        return;
      }

      const payload = (api as any)?.data ?? api;

      const list: Booking[] =
        (Array.isArray(payload?.booking) && payload.booking) ||
        (Array.isArray(payload?.bookings) && payload.bookings) ||
        (Array.isArray(payload?.data?.booking) && payload.data.booking) ||
        (Array.isArray(payload?.data?.bookings) && payload.data.bookings) ||
        [];

      setBookings(list);

      const total =
        payload?.totalCount ??
        payload?.total ??
        payload?.pagination?.total ??
        (api as any)?.totalCount ??
        (api as any)?.total ??
        list.length;

      setTotalCount(Number(total) || 0);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, BOOKINGS_URL]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    setDeleteError("");
    try {
      await axiosInstance.delete(getDeleteUrl(deleteTarget._id), {
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });

      setBookings((prev) => prev.filter((x) => x._id !== deleteTarget._id));
      setTotalCount((c) => Math.max(0, c - 1));

      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (e: any) {
      console.error("Delete booking failed:", e);
      setDeleteError(e?.response?.data?.message || "Could not delete booking.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 1.5, sm: 3 }, width: "100%" }}>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            pt: { xs: 2, sm: 3 },
            pb: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <SectionTitle title="Booking List" />
        </Box>

        {/* MOBILE => CARDS */}
        {isMobile ? (
          <Box sx={{ px: 2, pb: 2 }}>
            {loading ? (
              <Box sx={{ py: 6, textAlign: "center" }}>Loading...</Box>
            ) : bookings.length === 0 ? (
              <Box sx={{ py: 6, textAlign: "center" }}>No bookings found</Box>
            ) : (
              <Stack spacing={1.5}>
                {bookings.map((b) => {
                  const chip = statusChipProps(b.status);
                  const userAvatar = b.user?.profileImage || "/images/default-avatar.jpg";

                  return (
                    <Card key={b._id} variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
                            <Avatar
                              src={userAvatar}
                              variant="rounded"
                              sx={{ width: 46, height: 46, borderRadius: 2, bgcolor: "grey.200" }}
                              imgProps={{ style: { objectFit: "cover" } }}
                            />
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 800 }} noWrap>
                                {b.room?.roomNumber || "-"}
                              </Typography>
                              <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
                                {b.user?.userName || "-"}
                              </Typography>
                            </Box>
                          </Box>

                          <Tooltip title="View" arrow>
                            <IconButton
                              size="small"
                              onClick={() => openViewModal(b)}
                              sx={{ width: 38, height: 38, borderRadius: 2, border: "1px solid", borderColor: "divider" }}
                              aria-label="view booking"
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>

                        <Divider sx={{ my: 1.5 }} />

                        <Stack spacing={1}>
                          <Row label="Price" value={money(b.totalPrice)} />
                          <Row label="Start Date" value={formatDate(b.startDate)} />
                          <Row label="End Date" value={formatDate(b.endDate)} />

                          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center" }}>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                              Status
                            </Typography>
                            <Chip
                              label={chip.label}
                              color={chip.color}
                              variant={chip.variant}
                              size="small"
                              sx={{ borderRadius: 2, fontWeight: 700 }}
                            />
                          </Box>

                          <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 0.5 }}>
                            <Tooltip title="Delete" arrow>
                              <IconButton
                                size="small"
                                onClick={() => openDeleteModal(b)}
                                sx={{ width: 36, height: 36, borderRadius: 2, color: "error.main" }}
                                aria-label="delete booking"
                              >
                                <DeleteOutlineRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            )}
          </Box>
        ) : (
          /* DESKTOP => TABLE (زي Users) */
          <TableContainer sx={{ width: "100%", px: 2.5, pb: 1.5, overflowX: "auto" }}>
            <Table stickyHeader aria-label="booking table" sx={{ width: "100%", minWidth: 900, borderCollapse: "separate" }}>
              <TableHead>
                <TableRow>
                  {columns.map((column, idx) => (
                    <TableCell
                      key={column.id}
                      align={column.align || "left"}
                      sx={{
                        minWidth: column.minWidth,
                        bgcolor: "#EEF1F5",
                        color: "text.secondary",
                        fontWeight: 600,
                        borderBottom: 0,
                        py: 1.6,
                        whiteSpace: "nowrap",
                        ...(idx === 0 && { borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }),
                        ...(idx === columns.length - 1 && { borderTopRightRadius: 12, borderBottomRightRadius: 12 }),
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center" sx={{ py: 6, borderBottom: 0 }}>
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center" sx={{ py: 6, borderBottom: 0 }}>
                      No bookings found
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((b, rowIdx) => {
                    const chip = statusChipProps(b.status);

                    return (
                      <TableRow
                        key={b._id}
                        hover
                        sx={{
                          "& td": { borderBottom: "1px solid", borderColor: "divider", py: 1.8 },
                          bgcolor: rowIdx % 2 === 1 ? "rgba(0,0,0,0.015)" : "transparent",
                          "&:hover .actionLabel": { opacity: 1, transform: "translateX(0px)" },
                        }}
                      >
                        <TableCell>{b.room?.roomNumber || "-"}</TableCell>
                        <TableCell>{money(b.totalPrice)}</TableCell>
                        <TableCell>{formatDate(b.startDate)}</TableCell>
                        <TableCell>{formatDate(b.endDate)}</TableCell>
                        <TableCell>{b.user?.userName || "-"}</TableCell>

                        <TableCell>
                          <Chip
                            label={chip.label}
                            color={chip.color}
                            variant={chip.variant}
                            size="small"
                            sx={{ borderRadius: 2, fontWeight: 700 }}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
                            <Tooltip title="View" arrow>
                              <IconButton
                                size="small"
                                onClick={() => openViewModal(b)}
                                sx={{ width: 34, height: 34, borderRadius: 2, color: "primary.main" }}
                                aria-label="view booking"
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete" arrow>
                              <IconButton
                                size="small"
                                onClick={() => openDeleteModal(b)}
                                sx={{ width: 34, height: 34, borderRadius: 2, color: "error.main" }}
                                aria-label="delete booking"
                              >
                                <DeleteOutlineRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Typography
                              className="actionLabel"
                              variant="body2"
                              sx={{
                                opacity: 0,
                                transform: "translateX(-4px)",
                                transition: "all .15s ease",
                                color: "text.secondary",
                                userSelect: "none",
                                whiteSpace: "nowrap",
                              }}
                            >
                              View / Delete
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={totalCount}
          rowsPerPage={size}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ px: { xs: 2, sm: 2.5 }, borderTop: "1px solid", borderColor: "divider" }}
        />

        {/* VIEW (simpler) */}
        <BookingViewDialog open={viewOpen} booking={selectedBooking} onClose={closeViewModal} />

        {/* DELETE CONFIRM (MUI) */}
        <DeleteConfirmDialog
          open={deleteOpen}
          booking={deleteTarget}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          loading={deleting}
          error={deleteError}
        />
      </Paper>
    </Box>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: "right" }}>
        {value || "-"}
      </Typography>
    </Box>
  );
}

/** ✅ View dialog أبسط */
function BookingViewDialog({
  open,
  booking,
  onClose,
}: {
  open: boolean;
  booking: Booking | null;
  onClose: () => void;
}) {
  const chip = statusChipProps(booking?.status);
  const userAvatar = booking?.user?.profileImage || "/images/default-avatar.jpg";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pr: 6, fontWeight: 800 }}>
        Booking Details
        <IconButton
          onClick={onClose}
          aria-label="close"
          sx={{ position: "absolute", right: 10, top: 10, width: 36, height: 36, borderRadius: 2 }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        {!booking ? (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            No data
          </Typography>
        ) : (
          <Stack spacing={2}>
            {/* Top simple header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                src={userAvatar}
                variant="rounded"
                sx={{ width: 52, height: 52, borderRadius: 2, bgcolor: "grey.200" }}
                imgProps={{ style: { objectFit: "cover" } }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 900 }} noWrap>
                  {booking.user?.userName || "-"}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
                  Room: {booking.room?.roomNumber || "-"}
                </Typography>
              </Box>

              <Box sx={{ ml: "auto" }}>
                <Chip
                  label={chip.label}
                  color={chip.color}
                  variant={chip.variant}
                  size="small"
                  sx={{ borderRadius: 2, fontWeight: 700 }}
                />
              </Box>
            </Box>

            <Divider />

            {/* Simple grid */}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
              <InfoItem label="Start Date" value={formatDate(booking.startDate)} />
              <InfoItem label="End Date" value={formatDate(booking.endDate)} />
              <InfoItem label="Price" value={money(booking.totalPrice)} />
              <InfoItem label="Booking ID" value={booking._id} />
            </Box>

            {(booking.user?.email || booking.user?.phoneNumber || booking.user?.country) && (
              <>
                <Divider />
                <Typography sx={{ fontWeight: 900 }}>User Info</Typography>

                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                  <InfoItem label="Email" value={booking.user?.email} />
                  <InfoItem label="Phone" value={booking.user?.phoneNumber} />
                  <InfoItem label="Country" value={booking.user?.country} />
                  <InfoItem label="User ID" value={booking.user?._id} />
                </Box>
              </>
            )}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({ label, value }: { label: string; value?: string }) {
  return (
    <Box sx={{ p: 1.25, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
        {value || "-"}
      </Typography>
    </Box>
  );
}

/** ✅ Delete dialog بـ MUI */
function DeleteConfirmDialog({
  open,
  booking,
  onClose,
  onConfirm,
  loading,
  error,
}: {
  open: boolean;
  booking: Booking | null;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  error?: string;
}) {
  const name = booking?.user?.userName || "User";
  const room = booking?.room?.roomNumber || "-";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pr: 6, fontWeight: 800 }}>
        Delete Booking
        <IconButton
          onClick={onClose}
          aria-label="close"
          disabled={loading}
          sx={{ position: "absolute", right: 10, top: 10, width: 36, height: 36, borderRadius: 2 }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Typography sx={{ mb: 1.5 }}>
          Are you sure you want to delete booking for <b>{name}</b> (Room: <b>{room}</b>)?
        </Typography>

        {!!error && <Alert severity="error">{error}</Alert>}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading} variant="outlined" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
          disabled={loading || !booking}
          variant="contained"
          color="error"
          sx={{ borderRadius: 2, minWidth: 120 }}
        >
          {loading ? <CircularProgress size={18} /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
ل

