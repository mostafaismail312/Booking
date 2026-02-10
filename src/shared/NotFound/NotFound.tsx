import * as React from "react";
import {
  Box,
  Grid,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";



import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff", display: "flex", alignItems: "center" }}>
      <Container maxWidth={false} disableGutters>
        <Box sx={{ px: { xs: 4, md: 12 }, py: { xs: 6, md: 10 } }}>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            {/* LEFT */}
            <Grid size={7}>
              <Stack spacing={2.2}>
                <Typography
                  sx={{
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    color: "#142B55",
                    fontSize: mdUp ? 84 : 56,
                  }}
                >
                  404
                </Typography>

                <Typography
                  variant={mdUp ? "h3" : "h4"}
                  sx={{
                    fontWeight: 850,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                    color: "#142B55",
                  }}
                >
                  Page not found
                </Typography>

                <Typography
                  sx={{
                    maxWidth: 520,
                    color: "rgba(20,43,85,0.55)",
                    fontSize: 15,
                    lineHeight: 1.7,
                  }}
                >
                  The page you’re looking for doesn’t exist or might have been moved.
                  <br />
                  Try going back, or head to the homepage.
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.4} sx={{ pt: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<HomeRoundedIcon />}
                    onClick={() => navigate("/")}
                    sx={{
                      height: 44,
                      px: 2.2,
                      borderRadius: 1.6,
                      textTransform: "none",
                      fontWeight: 850,
                      boxShadow: "0 10px 20px rgba(56,92,255,0.25)",
                    }}
                  >
                    Go to Home
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<ArrowBackRoundedIcon />}
                    onClick={() => navigate(-1)}
                    sx={{
                      height: 44,
                      px: 2.2,
                      borderRadius: 1.6,
                      textTransform: "none",
                      fontWeight: 850,
                      borderColor: "rgba(20,43,85,0.18)",
                      color: "#142B55",
                      "&:hover": {
                        borderColor: "rgba(20,43,85,0.28)",
                        bgcolor: "rgba(20,43,85,0.02)",
                      },
                    }}
                  >
                    Back
                  </Button>

                  <Button
                    variant="text"
                    startIcon={<SearchRoundedIcon />}
                    onClick={() => navigate("/rooms?page=1&size=10")}
                    sx={{
                      height: 44,
                      px: 1.2,
                      borderRadius: 1.6,
                      textTransform: "none",
                      fontWeight: 850,
                      color: "#142B55",
                      "&:hover": { bgcolor: "rgba(20,43,85,0.04)" },
                    }}
                  >
                    Explore rooms
                  </Button>
                </Stack>

                <Paper
                  elevation={0}
                  sx={{
                    mt: 2.2,
                    maxWidth: 560,
                    borderRadius: 2,
                    border: "1px solid rgba(20,43,85,0.08)",
                    p: 2,
                    bgcolor: "rgba(20,43,85,0.02)",
                  }}
                >
                  <Typography sx={{ fontSize: 13, color: "rgba(20,43,85,0.65)", fontWeight: 700 }}>
                    Tip
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "rgba(20,43,85,0.55)", mt: 0.4 }}>
                    If you typed the URL manually, double-check the spelling.
                  </Typography>
                </Paper>
              </Stack>
            </Grid>

            {/* RIGHT (Illustration card) */}
            <Grid size={5}>
              <Box sx={{ position: "relative", width: "100%", maxWidth: "100%", mx: { xs: "auto", md: "unset" } }}>
                {/* خلفية border زي اللي عندك */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: { xs: "16px 12px -10px 40px", md: "18px 18px -14px 60px" },
                    borderRadius: 4,
                    border: "2px solid rgba(20,43,85,0.08)",
                    bgcolor: "#fff",
                  }}
                />

                {/* كارت بنفس Rounded top-left */}
                <Box
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    height: { xs: 260, sm: 320, md: 460 },
                    boxShadow: "0 24px 60px rgba(20,43,85,0.14)",
                    bgcolor: "#eaf3ff",
                    borderRadius: 0,
                    borderTopLeftRadius: 110,
                  }}
                >
                  {/* Gradient background */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "radial-gradient(80% 60% at 30% 35%, rgba(56,92,255,0.35), transparent 60%)," +
                        "radial-gradient(70% 60% at 70% 65%, rgba(29,186,136,0.28), transparent 55%)," +
                        "linear-gradient(135deg, rgba(20,43,85,0.06), rgba(20,43,85,0.01))",
                    }}
                  />

                  {/* Decorative blobs */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: 220,
                      height: 220,
                      right: -70,
                      top: -70,
                      borderRadius: "50%",
                      bgcolor: "rgba(241,82,58,0.18)",
                      filter: "blur(0px)",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      width: 260,
                      height: 260,
                      left: -90,
                      bottom: -90,
                      borderRadius: "50%",
                      bgcolor: "rgba(14,42,90,0.10)",
                    }}
                  />

                  {/* Big text inside */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "grid",
                      placeItems: "center",
                      px: 3,
                    }}
                  >
                    <Stack spacing={1} alignItems="center">
                      <Typography
                        sx={{
                          fontWeight: 950,
                          letterSpacing: "-0.04em",
                          color: "#142B55",
                          fontSize: mdUp ? 64 : 46,
                          lineHeight: 1,
                        }}
                      >
                        Oops!
                      </Typography>
                      <Typography sx={{ color: "rgba(20,43,85,0.65)", fontWeight: 800 }}>
                        We can’t find that page
                      </Typography>
                    </Stack>
                  </Box>

                  {/* small bottom chips */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: 18,
                      bottom: 16,
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        px: 1.2,
                        py: 0.6,
                        borderRadius: 999,
                        bgcolor: "rgba(255,255,255,0.75)",
                        border: "1px solid rgba(20,43,85,0.10)",
                        fontSize: 12,
                        fontWeight: 800,
                        color: "rgba(20,43,85,0.7)",
                      }}
                    >
                      #not-found
                    </Box>
                    <Box
                      sx={{
                        px: 1.2,
                        py: 0.6,
                        borderRadius: 999,
                        bgcolor: "rgba(255,255,255,0.75)",
                        border: "1px solid rgba(20,43,85,0.10)",
                        fontSize: 12,
                        fontWeight: 800,
                        color: "rgba(20,43,85,0.7)",
                      }}
                    >
                      #404
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
