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
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";

import { axiosInstance } from "../../../services/axiosInstance";
import { ADMIN_URLS } from "../../../services/apiEndpoints";
import SectionTitle from "../../../shared/SectionTitle/SectionTitle";

interface User {
  _id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  country: string;
  profileImage: string;
}

interface Column {
  id: keyof User | "Action";
  label: string;
  minWidth: number;
  align?: "left" | "center" | "right";
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);

  // View modal
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const columns: Column[] = useMemo(
    () => [
      { id: "userName", label: "User Name", minWidth: 170 },
      { id: "email", label: "Email", minWidth: 220 },
      { id: "phoneNumber", label: "Phone Number", minWidth: 160 },
      { id: "country", label: "Country", minWidth: 120 },
      { id: "profileImage", label: "Profile Image", minWidth: 160 },
      { id: "Action", label: "", minWidth: 90, align: "right" },
    ],
    []
  );

  const openViewModal = (user: User) => {
    setSelectedUser(user);
    setViewOpen(true);
  };

  const closeViewModal = () => {
    setViewOpen(false);
    setSelectedUser(null);
  };

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => setPage(newPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(ADMIN_URLS.USER.GET_ALL_USERS, {
          params: { page: page + 1, size },
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        const usersData = Array.isArray(response.data?.data?.users)
          ? response.data.data.users
          : [];

        setUsers(usersData);
        setTotalCount(response.data?.data?.totalCount || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
        setUsers([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, size]);

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
          bgcolor: "#000",
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
          <SectionTitle title="Booking Table Details" />
        </Box>

        {/* MOBILE => CARDS */}
        {isMobile ? (
          <Box sx={{ px: 2, pb: 2 }}>
            {loading ? (
              <Box sx={{ py: 6, textAlign: "center" }}>Loading...</Box>
            ) : users.length === 0 ? (
              <Box sx={{ py: 6, textAlign: "center" }}>No users found</Box>
            ) : (
              <Stack spacing={1.5}>
                {users.map((u) => (
                  <Card
                    key={u._id}
                    variant="outlined"
                    sx={{ borderRadius: 3, overflow: "hidden" }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 1.5,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.25,
                            minWidth: 0,
                          }}
                        >
                          <Avatar
                            src={u.profileImage || undefined}
                            variant="rounded"
                            sx={{
                              width: 46,
                              height: 46,
                              borderRadius: 2,
                              bgcolor: "grey.200",
                            }}
                            imgProps={{ style: { objectFit: "cover" } }}
                          />
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 700 }}
                              noWrap
                            >
                              {u.userName || "-"}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary" }}
                              noWrap
                            >
                              {u.email || "-"}
                            </Typography>
                          </Box>
                        </Box>

                        {/* icon only */}
                        <Tooltip title="View" arrow>
                          <IconButton
                            size="small"
                            onClick={() => openViewModal(u)}
                            sx={{
                              width: 38,
                              height: 38,
                              borderRadius: 2,
                              border: "1px solid",
                              borderColor: "divider",
                            }}
                            aria-label="view user"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      <Divider sx={{ my: 1.5 }} />

                      <Stack spacing={1}>
                        <Row label="Phone Number" value={u.phoneNumber} />
                        <Row label="Country" value={u.country} />
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Box>
        ) : (
          /* DESKTOP => TABLE */
          <TableContainer
            sx={{
              width: "100%",
              px: 2.5,
              pb: 1.5,
              overflowX: "auto", 
            }}
          >
            <Table
              stickyHeader
              aria-label="users table"
              sx={{
                width: "100%",
                minWidth: 900, 
                borderCollapse: "separate",
              }}
            >
              <TableHead>
                <TableRow>
                  {columns.map((column, idx) => (
                    <TableCell
                      key={String(column.id)}
                      align={column.align || "left"}
                      sx={{
                        minWidth: column.minWidth,
                        bgcolor: "#EEF1F5",
                        color: "text.secondary",
                        fontWeight: 600,
                        borderBottom: 0,
                        py: 1.6,
                        ...(idx === 0 && {
                          borderTopLeftRadius: 12,
                          borderBottomLeftRadius: 12,
                        }),
                        ...(idx === columns.length - 1 && {
                          borderTopRightRadius: 12,
                          borderBottomRightRadius: 12,
                        }),
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
                    <TableCell
                      colSpan={columns.length}
                      align="center"
                      sx={{ py: 6, borderBottom: 0 }}
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      align="center"
                      sx={{ py: 6, borderBottom: 0 }}
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user, rowIdx) => (
                    <TableRow
                      key={user._id}
                      hover
                      sx={{
                        "& td": {
                          borderBottom: "1px solid",
                          borderColor: "divider",
                          py: 1.8,
                        },
                        bgcolor:
                          rowIdx % 2 === 1 ? "rgba(0,0,0,0.015)" : "transparent",
                        // hover show label
                        "&:hover .viewLabel": {
                          opacity: 1,
                          transform: "translateX(0px)",
                        },
                      }}
                    >
                      {columns.map((column) => {
                        const value = (user as any)[column.id];

                        if (column.id === "profileImage") {
                          return (
                            <TableCell key={String(column.id)}>
                              <Avatar
                                src={value || undefined}
                                variant="rounded"
                                sx={{
                                  width: 44,
                                  height: 44,
                                  borderRadius: 2,
                                  bgcolor: "grey.200",
                                }}
                                imgProps={{ style: { objectFit: "cover" } }}
                              />
                            </TableCell>
                          );
                        }

                        if (column.id === "Action") {
                          return (
                            <TableCell key={String(column.id)} align="right">
                              <Box
                                sx={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                {/* Icon only */}
                                <Tooltip title="View" arrow>
                                  <IconButton
                                    size="small"
                                    onClick={() => openViewModal(user)}
                                    sx={{
                                      width: 34,
                                      height: 34,
                                      borderRadius: 2,
                                    
                                   
                                       color: "primary.main"
                                    }}
                                    aria-label="view user"
                                  >
                                    <VisibilityIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>

                                {/* Hover label */}
                                <Typography
                                  className="viewLabel"
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
                                  View
                                </Typography>
                              </Box>
                            </TableCell>
                          );
                        }

                        return (
                          <TableCell key={String(column.id)}>
                            {value ?? "-"}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
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
          sx={{
            px: { xs: 2, sm: 2.5 },
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        />

        {/* VIEW MODAL */}
        <ViewDialog open={viewOpen} user={selectedUser} onClose={closeViewModal} />
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

function ViewDialog({
  open,
  user,
  onClose,
}: {
  open: boolean;
  user: User | null;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          minHeight: { xs: "85vh", sm: "75vh" }, 
        },
      }}
    >
      {/* Header Banner */}
      <Box
        sx={{
          position: "relative",
          px: { xs: 2, sm: 3 },
          pt: { xs: 2.5, sm: 3 },
          pb: { xs: 6, sm: 7 },
          background:
            "linear-gradient(135deg, rgba(238,241,245,1) 0%, rgba(245,247,250,1) 55%, rgba(255,255,255,1) 100%)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <IconButton
          onClick={onClose}
          aria-label="close"
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            width: 40,
            height: 40,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <CloseRoundedIcon />
        </IconButton>

        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          User Profile
        </Typography>
       

        {/* Floating avatar */}
        <Box
          sx={{
            position: "absolute",
            left: { xs: 16, sm: 24 },
            bottom: { xs: -34, sm: -38 },
            display: "flex",
            alignItems: "flex-end",
            gap: 1.5,
          }}
        >
          <Avatar
            src={user?.profileImage || undefined}
            variant="rounded"
            sx={{
              width: { xs: 72, sm: 86 },
              height: { xs: 72, sm: 86 },
              borderRadius: 3,
              border: "3px solid",
              borderColor: "background.paper",
              bgcolor: "grey.200",
              boxShadow: "0 10px 25px rgba(0,0,0,.08)",
            }}
            imgProps={{ style: { objectFit: "cover" } }}
          />
          <Box sx={{ pb: 0.5, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 900, lineHeight: 1.1 }}
              noWrap
            >
              {user?.userName || "-"}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
              {user?.email || "-"}
            </Typography>
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ pt: { xs: 6, sm: 7 } }} dividers>
        {!user ? (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            No data
          </Typography>
        ) : (
          <Stack spacing={2.5}>
            {/* Quick tags */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                icon={<BadgeRoundedIcon />}
                label={`ID: ${user._id}`}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              />
              <Chip
                icon={<PublicRoundedIcon />}
                label={user.country ? `Country: ${user.country}` : "Country: -"}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              />
            </Box>

            <Divider />

            {/* Info grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 1.5,
              }}
            >
              <InfoCard
                icon={<MailOutlineRoundedIcon />}
                label="Email"
                value={user.email}
              />
              <InfoCard
                icon={<PhoneIphoneRoundedIcon />}
                label="Phone Number"
                value={user.phoneNumber}
              />
              <InfoCard
                icon={<PublicRoundedIcon />}
                label="Country"
                value={user.country}
              />
              <InfoCard
                icon={<BadgeRoundedIcon />}
                label="Username"
                value={user.userName}
              />
            </Box>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "rgba(0,0,0,0.02)",
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {label}
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }} noWrap>
            {value || "-"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
