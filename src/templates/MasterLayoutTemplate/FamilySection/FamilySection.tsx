import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

type Slide = {
  src: string;
  alt: string;
  title: string;
  quote: string;
  name: string;
  role: string;
  stars?: number;
};

export default function FamilySection() {
  const slides: Slide[] = useMemo(
    () => [
      {
        src: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1400&q=80",
        alt: "Happy family trip",
        title: "Happy Family",
        quote:
          "What a great trip with my family and I should try again next time soon ...",
        name: "Angga",
        role: "Product Designer",
        stars: 5,
      },
      {
        src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1400&q=80",
        alt: "Family photo",
        title: "Amazing Moment",
        quote:
          "Everything was smooth and the place felt super comfortable. We’ll definitely do it again.",
        name: "Sarah",
        role: "Marketing Lead",
        stars: 5,
      },
      {
        src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=80",
        alt: "Vacation memory",
        title: "Lovely Stay",
        quote:
          "Clean, calm, and perfect for family time. The memories we made are priceless.",
        name: "Omar",
        role: "Engineer",
        stars: 5,
      },
    ],
    []
  );

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

  const current = slides[active];

  return (
    <Box sx={{ py: { xs: 6, md: 16 }, bgcolor: "#fff", width: "100%" }}>
      <Container maxWidth={false} disableGutters>
        <Box sx={{ px: { xs: 2, sm: 4, md: 10 } }}>
          <Grid
            container
            alignItems="center"
            spacing={{ xs: 3, md: 4 }}          
            columnSpacing={{ xs: 2, md: 3 }}   
            sx={{ width: "100%" }}             
          >
      
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                sx={{
                  position: "relative",
                  width: "100%",
                  maxWidth: { xs: "100%", md: 560 }, 
                  mx: { xs: "auto", md: 0 },
                }}
              >
             
                <Box
                  sx={{
                    position: "absolute",
                    inset: {
                      xs: "-14px -14px 14px 14px",
                      md: "-18px -18px 18px 18px",
                    },
                    borderRadius: 3,
                    border: "2px solid rgba(20,43,85,0.10)",
                    bgcolor: "transparent",
                    zIndex: 0,
                  }}
                />

         
                <Box
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    overflow: "hidden",
                    height: { xs: 320, sm: 360, md: 420 },
                    width: "100%",
                    boxShadow: "0 24px 60px rgba(20,43,85,0.14)",
                    bgcolor: "#eaf3ff",
                    borderRadius: 14,
                    borderBottomRightRadius: 120,
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
                </Box>
              </Box>
            </Grid>

          
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2} sx={{ maxWidth: 560 }}>
                <Typography
                  sx={{
                    fontWeight: 800,
                    color: "#142B55",
                    fontSize: { xs: 22, md: 26 },
                  }}
                >
                  {current.title}
                </Typography>

                {/* Stars */}
                <Box sx={{ display: "flex", gap: 0.4 }}>
                  {Array.from({ length: current.stars ?? 5 }).map((_, idx) => (
                    <StarRoundedIcon
                      key={idx}
                      sx={{ color: "#F5B301", fontSize: 26 }}
                    />
                  ))}
                </Box>

                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#142B55",
                    fontSize: { xs: 20, md: 28 },
                    lineHeight: 1.35,
                  }}
                >
                  {current.quote}
                </Typography>

                <Typography
                  sx={{ color: "rgba(20,43,85,0.45)", fontWeight: 600 }}
                >
                  {current.name}, {current.role}
                </Typography>

                {/* Controls */}
                <Box sx={{ display: "flex", gap: 2, pt: 1 }}>
                  <IconButton
                    onClick={() => go(active - 1)}
                    sx={{
                      width: 54,
                      height: 54,
                      border: "2px solid #2D55FF",
                      color: "#2D55FF",
                      bgcolor: "#fff",
                      "&:hover": { bgcolor: "rgba(45,85,255,0.06)" },
                    }}
                  >
                    <ArrowBackRoundedIcon />
                  </IconButton>

                  <IconButton
                    onClick={() => go(active + 1)}
                    sx={{
                      width: 54,
                      height: 54,
                      border: "2px solid #2D55FF",
                      color: "#2D55FF",
                      bgcolor: "#fff",
                      "&:hover": { bgcolor: "rgba(45,85,255,0.06)" },
                    }}
                  >
                    <ArrowForwardRoundedIcon />
                  </IconButton>
                </Box>

                {/* Dots */}
                <Box sx={{ display: "flex", gap: 1, pt: 1 }}>
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
                            ? "rgba(45,85,255,0.95)"
                            : "rgba(20,43,85,0.15)",
                        cursor: "pointer",
                        transition: "all 220ms ease",
                      }}
                    />
                  ))}
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}


