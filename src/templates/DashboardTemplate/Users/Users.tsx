import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import { Box, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { axiosInstance } from '../../../services/axiosInstance';
import { ADMIN_URLS } from '../../../services/apiEndpoints';
import SectionTitle from '../../../shared/SectionTitle/SectionTitle';
import { useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  country: string;
  profileImage: string;
  Action?: string;
}

interface Column {
  id: keyof User;
  label: string;
  minWidth: number;
  align?: 'left' | 'center' | 'right';
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const menuOpen = Boolean(anchorEl);

  const navigate = useNavigate();

  const columns: Column[] = [
    { id: 'userName', label: 'User Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 100 },
    { id: 'phoneNumber', label: 'Phone Number', minWidth: 150 },
    { id: 'country', label: 'Country', minWidth: 100 },
    { id: 'profileImage', label: 'Profile Image', minWidth: 170 },
    { id: 'Action', label: 'Action', minWidth: 120, align: 'center' },
  ];

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, userId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  const handleView = () => {
    if (!selectedUserId) return;

    // عدّل المسار ده حسب عندك صفحة التفاصيل فين
    navigate(`/admin/users/${selectedUserId}`);

    handleMenuClose();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(ADMIN_URLS.USER.GET_ALL_USERS, {
          params: { page: page + 1, size },
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        });

        const usersData = Array.isArray(response.data?.data?.users)
          ? response.data.data.users
          : [];

        setUsers(usersData);
        setTotalCount(response.data?.data?.totalCount || 0);
      } catch (error) {
        console.error('Error fetching data:', error);
        setUsers([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, size]);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ height: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            my: 2,
            px: 2,
          }}
        >
          <SectionTitle title="Booking Table Details" />
        </Box>

        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={user._id}>
                  {columns.map((column) => {
                    const value = user[column.id];

                    return (
                      <TableCell key={String(column.id)} align={column.align || 'left'}>
                        {column.id === 'profileImage' ? (
                          <img
                            src={(value as string) || 'https://via.placeholder.com/50'}
                            alt="Profile"
                            width="50"
                            height="50"
                            style={{ borderRadius: 8, objectFit: 'cover' }}
                          />
                        ) : column.id === 'Action' ? (
                          <>
                            <IconButton
                              onClick={(e) => handleMenuOpen(e, user._id)}
                              aria-label="row actions"
                              aria-controls={menuOpen ? 'user-actions-menu' : undefined}
                              aria-haspopup="true"
                              aria-expanded={menuOpen ? 'true' : undefined}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </>
                        ) : (
                          (value as any)
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Menu واحد فقط لكل الجدول */}
        <Menu
          id="user-actions-menu"
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleView}>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="View" />
          </MenuItem>
        </Menu>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={totalCount}
        rowsPerPage={size}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'background.paper',
          zIndex: 1300,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      />
    </Paper>
  );
}
