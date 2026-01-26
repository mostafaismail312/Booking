import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import reset from '../../../assets/images/resetPassword.png'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useForm } from "react-hook-form";

import { useState } from 'react';
import { IconButton,InputAdornment} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

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

export default function ResetPass() {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (data: any) => {}
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm();

  return (
    <>
      <React.Fragment>
      <CssBaseline />
      <Container maxWidth={false} sx={{  height: '100vh' }}>
       <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1}>
            <Grid size={6}>
              <Typography variant="h4" gutterBottom sx={{ color: 'darkblue',m:'30px'}}>
                <Typography component="span" variant="h4" sx={{ color: 'blue' }}>
                  Stay
                </Typography>
                cation
              </Typography>
              <Grid>
                <Typography variant="h4" sx={{ mt:'70px', ml:'90px',fontWeight: 'bold' }}>
                  Reset Password
                </Typography>
              </Grid>

              <Grid>
                <Typography variant="h6" sx={{ mt:'20px', ml:'90px' }}>
                  If you already have an account register
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ color: 'darkred'}}>
                  <Typography component="span" variant="h6" sx={{ color: 'black', ml:'90px'}}>
                    You can 
                  </Typography>
                    Login here !
                </Typography>
              </Grid>

               <Box
                  component="form"
                  onSubmit={handleSubmit(onSubmit)}
                  sx={{ width: '70%', mx: 'auto' , ml:'90px' }}
                >
                  <Grid direction="column" spacing={2}>
                    <Grid>
                      <Typography>Email</Typography>
                      <TextField id='email' fullWidth variant="filled" {...register('email')}/>
                    </Grid>

                    <Grid>
                      <Typography>OTP</Typography>
                      <TextField id='seed' fullWidth variant="filled" {...register('seed')}/>
                    </Grid>

                    <Grid>
                      <Typography>Password</Typography>
                      <TextField id='password' {...register('password')}
                        fullWidth
                        variant="filled"
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    {/* Confirm Password */}
                    <Grid sx={{ mt: 2 }}>
                      <Typography>Confirm Password</Typography>
                      <TextField id='confirmPassword' {...register('confirmPassword')}
                        fullWidth
                        variant="filled"
                        type={showConfirm ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirm(!showPassword)}
                                edge="end"
                              >
                                {showConfirm ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  
                  </Grid>
               



              <Grid sx={{ mt:'10px'}}>
                <Button fullWidth variant="contained">Reset</Button>
              </Grid>
               </Box>
            </Grid>
            
            <Grid size={6}>
              
              <Box
                component="img"
                sx={{
                  width: {
                    height:'90%', // width on extra-small screens
                     width: '90%', // width on medium screens and up
                  },
                }}
                alt="The house from the offer."
                src={reset}
              />
            </Grid>
            
          </Grid>
        </Box>
      </Container>
    </React.Fragment>
    </>
  )
}
