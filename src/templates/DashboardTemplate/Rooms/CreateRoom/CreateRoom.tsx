import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../../../services/axiosInstance';
import { ADMIN_URLS } from '../../../../services/apiEndpoints';

type Facility = {
  _id: string;
  name: string;
};

interface RoomFormData {
  roomNumber: string;
  price: number;
  capacity: number;
  discount?: number;
  facilities: string[];
}

export default function CreateRoom() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [roomImages, setRoomImages] = useState<File | { name: string; url: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<RoomFormData>({
    defaultValues: {
      roomNumber: '',
      price: 0,
      capacity: 1,
      discount: 0,
      facilities: [],
    },
  });

  // Fetch facilities
  useEffect(() => {
  const fetchFacilities = async () => {
    try {
      const res = await axiosInstance.get(ADMIN_URLS.ROOM.GET_ROOM_FACILITIES);
      const facilitiesData = res.data?.data?.facilities ?? [];
      setFacilities(Array.isArray(facilitiesData) ? facilitiesData : []);
    } catch (err) {
      console.error('Failed to load facilities', err);
      toast.error('Failed to load facilities');
    }
  };

  fetchFacilities();
}, []);

  // Fetch room if editing
  useEffect(() => {
    if (!id) return;

    const fetchRoom = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(ADMIN_URLS.ROOM.GET_ROOM(id));
        const room = res.data?.data?.room;

        if (room) {
          reset({
            roomNumber: room.roomNumber,
            price: room.price,
            capacity: room.capacity,
            discount: room.discount,
            facilities: room.facilities?.map(f => f._id) || [],
          });

          if (room.images?.[0]) {
            setRoomImages({ name: 'Current Image', url: room.images[0] });
          }
        }
      } catch (err) {
        console.error('Failed to fetch room:', err);
        toast.error('Failed to load room data');
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id, reset]);

  // Dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) setRoomImages(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

 const onSubmit = async (data: RoomFormData) => {
  try {
    const formData = new FormData();
    formData.append('roomNumber', data.roomNumber);
    formData.append('price', String(data.price));
    formData.append('capacity', String(data.capacity));
    formData.append('discount', String(data.discount ?? 0));

    // ✅ Append each facility individually
    data.facilities.forEach(facilityId => formData.append('facilities', facilityId));

    if (roomImages instanceof File) formData.append('imgs', roomImages);

    if (id) {
      // Edit
      await axiosInstance.put(ADMIN_URLS.ROOM.UPDATE_ROOM(id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Room updated successfully');
    } else {
      // Create
      await axiosInstance.post(ADMIN_URLS.ROOM.CREATE_ROOM, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Room created successfully');
    }

    navigate('/dashboard/rooms');
  } catch (err: any) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Failed to submit room');
  }
};


  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 5 }} />;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        {/* Room Number */}
        <TextField
          label="Room Number"
          {...register('roomNumber', { required: 'Room Number is required' })}
          error={!!errors.roomNumber}
          helperText={errors.roomNumber?.message}
          fullWidth
          sx={{ mb: 2 }}
        />

        {/* Price & Capacity */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} sx={{ width: '49%' }}>
            <TextField
              label="Price"
              type="number"
              {...register('price', { required: 'Price is required' })}
              error={!!errors.price}
              helperText={errors.price?.message}
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={6} sx={{ width: '49%' }}>
            <TextField
              label="Capacity"
              type="number"
              {...register('capacity', { required: 'Capacity is required' })}
              error={!!errors.capacity}
              helperText={errors.capacity?.message}
              sx={{ width: '100%' }}
            />
          </Grid>
        </Grid>

        {/* Discount & Facilities */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} sx={{ width: '49%' }}>
            <TextField
              label="Discount (%)"
              type="number"
              {...register('discount')}
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={6} sx={{ width: '49%' }}>
            <FormControl sx={{ width: '100%' }}>
              <InputLabel id="facilities-label">Facilities</InputLabel>
              <Controller
                name="facilities"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="facilities-label"
                    multiple
                    renderValue={selected =>
                      facilities
                        .filter(f => selected.includes(f._id))
                        .map(f => f.name)
                        .join(', ')
                    }
                  >
                    {facilities.map(f => (
                      <MenuItem key={f._id} value={f._id}>
                        <Checkbox checked={field.value.includes(f._id)} />
                        <ListItemText primary={f.name} />
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          </Grid>
        </Grid>

        {/* Dropzone */}
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed #aaa',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            mb: 3,
            cursor: 'pointer',
            backgroundColor: isDragActive ? '#f0f0f0' : 'transparent',
          }}
        >
          <input {...getInputProps()} />
          {roomImages ? (
            'url' in roomImages ? (
              <img
                src={roomImages.url}
                alt="room"
                style={{ width: 100, height: 80, objectFit: 'cover', borderRadius: 4 }}
              />
            ) : (
              <Typography>{roomImages.name}</Typography>
            )
          ) : (
            <Typography>Drag & drop a room image here, or click to select</Typography>
          )}
        </Box>

        {/* Submit */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" color="primary" size="large" sx={{ px: 6, py: 1.5 }}>
            {id ? 'Update Room' : 'Create Room'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
