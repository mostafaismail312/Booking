import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import signup from '../../../assets/images/signup.png';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import Dropzone from 'react-dropzone';

import { useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import valid from '../../../services/validation';
import { axiosInstance } from '../../../services/axiosInstance';
import { ADMIN_URLS } from '../../../services/apiEndpoints';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

export default function Register() {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      role: 'user', // will be sent automatically
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setProfileImage(acceptedFiles[0]);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();

      // Append all fields (including role = "user")
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const response = await axiosInstance.post(
        ADMIN_URLS.USER.CREATE_USER,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      toast.success('Account created successfully');
      navigate('/login');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth={false} sx={{ height: '100vh' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1}>
            {/* Left side - Form */}
            <Grid size={6}>
              <Typography variant="h4" gutterBottom sx={{ color: 'darkblue', m: '30px' }}>
                <Typography component="span" variant="h4" sx={{ color: 'blue' }}>
                  Stay
                </Typography>
                cation
              </Typography>

              <Typography variant="h4" sx={{ mt: '70px', ml: '90px', fontWeight: 'bold' }}>
                Sign up
              </Typography>

              <Typography variant="h6" sx={{ mt: '20px', ml: '90px' }}>
                If you already have an account register
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ color: 'darkred' }}>
                <Typography component="span" variant="h6" sx={{ color: 'black', ml: '90px' }}>
                  You can
                </Typography>{' '}
                Login here !
              </Typography>

              {/* Profile Image Dropzone */}
              <Dropzone onDrop={onDrop} accept={{ 'image/*': [] }} maxFiles={1}>
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    style={{
                      width: '110px',
                      height: '110px',
                      borderRadius: '50%',
                      border: '3px dashed #9ef0c1',
                      cursor: 'pointer',
                      margin: '30px auto 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      background: 'rgba(255,255,255,0.05)',
                    }}
                  >
                    <input {...getInputProps()} />

                    {profileImage ? (
                      <img
                        src={URL.createObjectURL(profileImage)}
                        alt="profile"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div className="text-center text-white" style={{ fontSize: '12px' }}>
                        <i className="fa fa-camera mb-2" style={{ fontSize: '24px' }}></i>
                        <div>Upload</div>
                      </div>
                    )}
                  </div>
                )}
              </Dropzone>

              {/* Form */}
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ width: '70%', mx: 'auto', ml: '90px' }}
              >
                {/* Hidden role field */}
                <input type="hidden" {...register('role')} />

                <Grid container direction="column" spacing={2}>
                  <Grid>
                    <Typography>User Name</Typography>
                    <TextField
                      id="userName"
                      fullWidth
                      variant="filled"
                      {...register('userName', valid.USERNAME_VALIDATION)}
                      error={!!errors.userName}
                      helperText={errors.userName?.message?.toString()}
                    />
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography>Phone Number</Typography>
                      <TextField
                        id="phoneNumber"
                        fullWidth
                        variant="filled"
                        {...register('phoneNumber')}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography>Country</Typography>
                      <TextField
                        id="country"
                        fullWidth
                        variant="filled"
                        {...register('country')}
                      />
                    </Grid>
                  </Grid>

                  <Grid>
                    <Typography>Email Address</Typography>
                    <TextField
                      id="email"
                      fullWidth
                      variant="filled"
                      {...register('email', valid.EMAIL_VALIDATION)}
                      error={!!errors.email}
                      helperText={errors.email?.message?.toString()}
                    />
                  </Grid>

                  <Grid>
                    <Typography>Password</Typography>
                    <TextField
                      id="password"
                      fullWidth
                      variant="filled"
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', valid.PASSWORD_VALIDATION('Password is required'))}
                      error={!!errors.password}
                      helperText={errors.password?.message?.toString()}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword((prev) => !prev)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid>
                    <Typography>Confirm Password</Typography>
                    <TextField
                      id="confirmPassword"
                      fullWidth
                      variant="filled"
                      type={showConfirm ? 'text' : 'password'}
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) =>
                          value === getValues('password') || 'Passwords do not match',
                      })}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message?.toString()}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirm((prev) => !prev)}
                              edge="end"
                            >
                              {showConfirm ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid sx={{ mt: '10px' }}>
                    <Button fullWidth variant="contained" type="submit">
                      Sign up
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Right side - Image */}
            <Grid size={6}>
              <Box
                component="img"
                src={signup}
                alt="signup"
                sx={{
                  width: '90%',
                  height: '90%',
                  mt: 3,
                  display: 'block',
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </React.Fragment>
  );
}