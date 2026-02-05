import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

type Slide = { src: string; alt: string };

export default function StartSection() {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));

  const slides: Slide[] = useMemo(
    () => [
      {
        src: "https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1400&q=80",
        alt: "Modern cabin",
      },
      {
        src: "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1400&q=80",
        alt: "Vacation house",
      },
      {
        src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=80",
        alt: "Beach stay",
      },
    ],
    []
  );

  const [people, setPeople] = useState(2);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = (next: number) => {
    const len = slides.length;
    setActive(((next % len) + len) % len);
  };

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => go(active + 1), 3500);
    return () => window.clearInterval(id);
  }, [active, paused]);

  return (
    <Box sx={{ py: { xs: 5, md: 8 }, bgcolor: "#fff", width: "100%" }}>
      {/* ✅ Full width container */}
      <Container maxWidth={false} disableGutters>
        {/* ✅ add padding manually */}
        <Box sx={{ px: { xs: 6, md: 12 } }}>
          <Grid
            container
            spacing={{ xs: 4, md: 6 }}
            alignItems="center"
            sx={{ width: "100%" }}
          >
            {/* LEFT */}
            <Grid size={7}>
              <Stack spacing={2.2}>
                <Typography
                  variant={mdUp ? "h2" : "h3"}
                  sx={{
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.05,
                    color: "#142B55",
                  }}
                >
                  Forget Busy Work,
                  <br />
                  Start Next Vacation
                </Typography>

                <Typography
                  sx={{
                    maxWidth: 520,
                    color: "rgba(20,43,85,0.55)",
                    fontSize: 15,
                    lineHeight: 1.6,
                  }}
                >
                  We provide what you need to enjoy your holiday with family.
                  <br />
                  Time to make another memorable moments.
                </Typography>

                <Box sx={{ pt: 1 }}>
                  <Typography sx={{ fontWeight: 800, color: "#142B55" }}>
                    Start Booking
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "rgba(20,43,85,0.6)",
                    }}
                  >
                    Pick a Date
                  </Typography>

                  <Stack spacing={1.6} sx={{ mt: 1.2, maxWidth: 520 }}>
                    {/* Date row */}
                    <Paper
                      elevation={0}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        borderRadius: 2,
                        border: "1px solid rgba(20,43,85,0.08)",
                        overflow: "hidden",
                        height: 46,
                      }}
                    >
                      <Box
                        sx={{
                          width: 52,
                          height: "100%",
                          display: "grid",
                          placeItems: "center",
                          bgcolor: "#0E2A5A",
                        }}
                      >
                        <CalendarMonthRoundedIcon sx={{ color: "#fff" }} />
                      </Box>
                      <Box sx={{ px: 2.2, flex: 1 }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "rgba(20,43,85,0.8)",
                          }}
                        >
                          20 Jan - 22 Jan
                        </Typography>
                      </Box>
                    </Paper>

                    {/* Capacity row */}
                    <Box>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "rgba(20,43,85,0.6)",
                          mb: 0.7,
                        }}
                      >
                        Capacity
                      </Typography>

                      <Paper
                        elevation={0}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          borderRadius: 2,
                          border: "1px solid rgba(20,43,85,0.08)",
                          overflow: "hidden",
                          height: 46,
                        }}
                      >
                        <Box
                          sx={{
                            width: 72,
                            height: "100%",
                            display: "grid",
                            placeItems: "center",
                            bgcolor: "#F1523A",
                          }}
                        >
                          <IconButton
                            onClick={() => setPeople((p) => Math.max(1, p - 1))}
                            sx={{ color: "#fff" }}
                          >
                            <RemoveRoundedIcon />
                          </IconButton>
                        </Box>

                        <Box sx={{ flex: 1, px: 2.2, textAlign: "center" }}>
                          <Typography
                            sx={{
                              fontWeight: 800,
                              color: "rgba(20,43,85,0.85)",
                            }}
                          >
                            {people} person
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            width: 72,
                            height: "100%",
                            display: "grid",
                            placeItems: "center",
                            bgcolor: "#1DBA88",
                          }}
                        >
                          <IconButton
                            onClick={() => setPeople((p) => p + 1)}
                            sx={{ color: "#fff" }}
                          >
                            <AddRoundedIcon />
                          </IconButton>
                        </Box>
                      </Paper>
                    </Box>

                    <Button
                      variant="contained"
                      sx={{
                        mt: 1,
                        height: 44,
                        width: 230,
                        borderRadius: 1.6,
                        textTransform: "none",
                        fontWeight: 800,
                        boxShadow: "0 10px 20px rgba(56,92,255,0.25)",
                      }}
                    >
                      Explore
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </Grid>

            {/* RIGHT (Swiper) */}
            <Grid size={5}>
              <Box
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                sx={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "100%", // ✅ was 560
                  mx: { xs: "auto", md: "unset" },
                }}
              >
                {/* back outline card */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: {
                      xs: "16px 12px -10px 40px",
                      md: "18px 18px -14px 60px",
                    },
                    borderRadius: 4,
                    border: "2px solid rgba(20,43,85,0.08)",
                    bgcolor: "#fff",
                  }}
                />

            
         <Box
  sx={{
    position: "relative",
    overflow: "hidden",
    height: { xs: 260, sm: 320, md: 460 },
    boxShadow: "0 24px 60px rgba(20,43,85,0.14)",
    bgcolor: "#eaf3ff",

    borderRadius: 0,           // باقي الزوايا
    borderTopLeftRadius: 110,   // 👈 الانحناء الكبير فوق شمال
  }}
>
                 
                  {slides.map((s, i) => (
                    <Box
                      key={s.src}
                      component="img"
                      src={s.src}
                      alt={s.alt}
                      sx={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: i === active ? 1 : 0,
                        transform: i === active ? "scale(1.02)" : "scale(1.06)",
                        transition: "opacity 650ms ease, transform 900ms ease",
                        willChange: "opacity, transform",
                      }}
                    />
                  ))}

                  {/* controls */}
                  {/* <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 1,
                      pointerEvents: "none",
                    }}
                  >
                    <IconButton
                      onClick={() => go(active - 1)}
                      sx={{
                        pointerEvents: "auto",
                        bgcolor: "rgba(255,255,255,0.85)",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.95)" },
                      }}
                    >
                      <ChevronLeftRoundedIcon />
                    </IconButton>

                    <IconButton
                      onClick={() => go(active + 1)}
                      sx={{
                        pointerEvents: "auto",
                        bgcolor: "rgba(255,255,255,0.85)",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.95)" },
                      }}
                    >
                      <ChevronRightRoundedIcon />
                    </IconButton>
                  </Box> */}

                  {/* dots */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 14,
                      display: "flex",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    {slides.map((_, i) => (
                      <Box
                        key={i}
                        onClick={() => go(i)}
                        sx={{
                          width: i === active ? 22 : 8,
                          height: 8,
                          borderRadius: 999,
                          bgcolor:
                            i === active
                              ? "rgba(255,255,255,0.95)"
                              : "rgba(255,255,255,0.55)",
                          cursor: "pointer",
                          transition: "all 220ms ease",
                        }}
                      />
                    ))}
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

