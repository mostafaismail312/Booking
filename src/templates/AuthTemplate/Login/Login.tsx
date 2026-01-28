import { Alert, Box, Container, Grid } from "@mui/material";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../services/axiosInstance";
import { ADMIN_URLS, PORTAL_URLS } from "../../../services/apiEndpoints";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import Logo from "../../../components/AuthComponents/Logo/Logo";
import { DASHBOARD_PATH, FORGET_PASS_PATH } from "../../../services/paths";
import validation from "../../../services/validation";
import SubmitBtn from "../../../layouts/AuthLayout/submitBtn";
import type { LoginProps } from "../../../interfaces/Auth";
import AuhtHeader from "../../../components/AuthComponents/AuhtHeader/AuhtHeader";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import RightSideImage from "../../../components/AuthComponents/RightSideImage/RightSideImage";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginProps>();
  const { saveLoginData, loginData } = useAuth();

  // =========== submit login ========
  const onSubmit = async (data: LoginProps) => {
    try {
      const response = await axiosInstance.post(PORTAL_URLS.USER.LOGIN, data);
      localStorage.setItem("token", response?.data.data.token);
      console.log("ana", response.data.data);

      if (response?.data.data?.user.role != "user") {
        navigate(DASHBOARD_PATH);
      } else {
        navigate("/");
      }

      saveLoginData();
      // await saveLoginData();
      // await getCurrentUser();
      toast.success("Login success!");
    } catch (error) {
      // console.log(error?.response?.data?.message);
      if (isAxiosError(error)) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    }
  };
  return (
    <>
      <Grid container height={"100vh"}>
        {/* Left Side: Form */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 4,
          }}
        >
          <Container maxWidth="sm">
            <Logo />
            <AuhtHeader
              header={"Sign in"}
              message={"If you don’t have an account register You can"}
              linkName={"Register here!"}
              link={"/register"}
            />
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Box
                sx={{
                  mt: "1.5rem",
                }}
              >
                <InputLabel
                  sx={{
                    color: "var(--dark-blue-color)",
                    fontWeight: "400",
                    fontSize: "16px",
                  }}
                >
                  Email Address
                </InputLabel>
                <FormControl
                  fullWidth
                  sx={{
                    margin: { top: ".3rem", bottom: "35px" },
                    // "& .MuiOutlinedInput-root": {
                    //   "& fieldset": {
                    //     border: "none",
                    //   },
                    // },
                  }}
                  variant="standard"
                >
                  <OutlinedInput
                    sx={{
                      background: "#f5f6f8",
                    }}
                    id="outlined-adornment-email"
                    type={"email"}
                    placeholder="Enter your Email"
                    {...register("email", validation.EMAIL_VALIDATION)}
                  />
                </FormControl>
                {errors.email && (
                  <Alert sx={{ marginBottom: "1rem" }} severity="error">
                    {errors.email.message}
                  </Alert>
                )}
              </Box>
              {/* =============== password ========================== */}

              <Box
                sx={{
                  mt: "1.5rem",
                }}
              >
                <InputLabel
                  sx={{
                    color: "var(--dark-blue-color)",
                    fontWeight: "400",
                    fontSize: "16px",
                  }}
                >
                  Password
                </InputLabel>
                <FormControl
                  fullWidth
                  sx={{
                    mt: ".3rem",
                  }}
                  variant="standard"
                >
                  <OutlinedInput
                    sx={{
                      background: "#f5f6f8",
                    }}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your Password"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword
                              ? "hide the password"
                              : "display the password"
                          }
                          onClick={handleTogglePassword}
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    {...register(
                      "password",
                      // validation.PASSWORD_VALIDATION("your password is requird")
                    )}
                  />
                </FormControl>
                {errors.password && (
                  <Alert sx={{ marginBottom: "1rem" }} severity="error">
                    {errors.password.message}
                  </Alert>
                )}
              </Box>

              <Box sx={{ my: 2 }} textAlign="right">
                <Link
                  to={FORGET_PASS_PATH}
                  style={{
                    color: "#4D4D4D",
                    fontWeight: "400",
                    fontSize: "16px",
                    textDecoration: "none",
                  }}
                >
                  Forgot Password ?
                </Link>
              </Box>

              <SubmitBtn isSubmitting={isSubmitting} title="Login" />
            </Box>
          </Container>
        </Grid>

        {/* Right Side: Image */}
        <RightSideImage
          text="Homes as unique as you."
          title="Sign in to Roamhome"
          imgPath="/loginbg.svg"
        />
      </Grid>
    </>
  );
}
