import React, { useState, useEffect } from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, IconButton, Menu, MenuItem, Dialog,
  DialogTitle, DialogContent, DialogActions, Button, Typography, Stack,
  Box
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../../../services/axiosInstance';
import { ADMIN_URLS } from '../../../../services/apiEndpoints';
import toast from 'react-hot-toast';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SectionTitle from '../../../../shared/SectionTitle/SectionTitle';
import { Add } from '@mui/icons-material';

/* ===== Interfaces ===== */
interface Facility { _id: string; name: string; }
interface CreatedBy { _id: string; userName: string; }
interface Room {
  _id: string;
  roomNumber: string;
  price: number;
  capacity: number;
  discount: number;
  facilities: Facility[];
  createdBy: CreatedBy;
  images: string[];
}

export default function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* Menu State */
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  /* Modal State */
  const [openView, setOpenView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  /* ===== Fetch Rooms ===== */
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(ADMIN_URLS.ROOM.GET_ALL_ROOMS, {
          params: { page: page + 1, size }
        });
        const roomsData = res.data?.data?.rooms || [];
        setRooms(Array.isArray(roomsData) ? roomsData : []);
        setTotalCount(res.data?.data?.totalCount || 0);
      } catch (error) {
        console.error(error);
      } finally { setLoading(false); }
    };
    fetchRooms();
  }, [page, size]);

  /* ===== Menu Handlers ===== */
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, room: Room) => {
    setAnchorEl(event.currentTarget);
    setSelectedRoom(room);
  };
  const handleMenuClose = () => { setAnchorEl(null); setSelectedRoom(null); };
  // const handleView = () => { setOpenView(true); handleMenuClose(); };
  const handleEdit = () => {
  navigate(`/dashboard/edit/${selectedRoom._id}`);
  handleMenuClose();
};

  /* ===== Delete Modal State ===== */
const [deleteRoom, setDeleteRoom] = useState<Room | null>(null);

/* ===== Menu Handlers ===== */
const handleDeleteClick = (room: Room) => {
  setDeleteRoom(room);
  setOpenDelete(true);
  setAnchorEl(null);
};

/* ===== Confirm Delete ===== */
const confirmDelete = async () => {
  if (!deleteRoom) return;
  try {
    await axiosInstance.delete(ADMIN_URLS.ROOM.DELETE_ROOM(deleteRoom._id));
    setRooms(prev => prev.filter(r => r._id !== deleteRoom._id));
    setOpenDelete(false);
    setDeleteRoom(null);
    toast.success("Room deleted successfully");
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete room");
  }
};

const handleView = async () => {
  if (!selectedRoom) return;

  try {
    const res = await axiosInstance.get(ADMIN_URLS.ROOM.GET_ROOM(selectedRoom._id));
    const roomDetails = res.data?.data?.room;

    if (roomDetails) {
      setSelectedRoom(roomDetails); // update state with full details
      setOpenView(true);
    }
  } catch (error) {
    console.error("Failed to fetch room details:", error);
  } finally {
    setAnchorEl(null); // close menu
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
        <SectionTitle title="Rooms Table Details" />
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          onClick={() => navigate("/dashboard/createroom")}
          sx={{
            textTransform: "none",
            borderRadius: "7px",
            backgroundColor: "#3F5FFF",
            "&:hover": {
              backgroundColor: "#2d44d2",
            },
          }}
        >
          {" "}
          Add New Room{" "}
        </Button>
      </Box> 

    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ height: '100%' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {['Room Number', 'Price', 'Capacity', 'Discount %', 'Facilities', 'Created By', 'Image', 'Actions'].map(label => (
                <TableCell key={label}>{label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">Loading...</TableCell>
              </TableRow>
            ) : (
              rooms.map(room => (
                <TableRow key={room._id} hover>
                  <TableCell>{room.roomNumber}</TableCell>
                  <TableCell>{room.price}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>{room.discount ?? '-'}</TableCell>
                  <TableCell>{room.facilities.map(f => f.name).join(', ') || '-'}</TableCell>
                  <TableCell>{room.createdBy?.userName ?? '-'}</TableCell>
                  <TableCell>
                    {room.images?.[0] ? <img src={room.images[0]} alt="room" width={50} height={40} style={{objectFit:'cover', borderRadius:4}}/> : '-'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleMenuOpen(e, room)}><MoreVertIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}

            {/* Actions Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleView}>
                <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
                View
              </MenuItem>

              <MenuItem onClick={handleEdit}>
                <EditIcon fontSize="small" sx={{ mr: 1 }} />
                Edit
              </MenuItem>

              <MenuItem
                onClick={() => handleDeleteClick(selectedRoom!)}
                sx={{ color: 'error.main' }}
              >
                <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                Delete
              </MenuItem>
            </Menu>

          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10,25,100]}
        component="div"
        count={totalCount}
        rowsPerPage={size}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={e => { setSize(parseInt(e.target.value,10)); setPage(0); }}
        sx={{position:'fixed', bottom:0, backgroundColor:'white', zIndex:1000}}
      />

      {/* ===== View Modal ===== */}
     <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="sm" fullWidth>
  <DialogTitle>Room Details</DialogTitle>
  <DialogContent dividers>
    {selectedRoom ? (
      <Stack spacing={1.5}>
        <Typography><b>Room Number:</b> {selectedRoom.roomNumber}</Typography>
        <Typography><b>Price:</b> {selectedRoom.price}</Typography>
        <Typography><b>Capacity:</b> {selectedRoom.capacity}</Typography>
        <Typography><b>Discount:</b> {selectedRoom.discount}%</Typography>
        <Typography><b>Facilities:</b> {selectedRoom.facilities?.map(f => f.name).join(', ')}</Typography>
        <Typography><b>Created By:</b> {selectedRoom.createdBy?.userName}</Typography>
        {selectedRoom.images?.length > 0 &&
          selectedRoom.images.map((img, idx) => (
            <img key={idx} src={img} alt={`room-${idx}`} style={{width:'100%', borderRadius:6}} />
          ))
        }
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
        <DialogTitle align="center"><DeleteOutlineIcon color="error" sx={{fontSize:50}}/></DialogTitle>
        <DialogContent>
          <Typography align="center">
  Are you sure you want to delete the room: {deleteRoom?.roomNumber}?
</Typography>

          <Typography align="center" color="text.secondary">This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{justifyContent:'center', pb:2}}>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Paper>
    </>
  );
}
