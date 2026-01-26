import { Box, Grid, Typography } from "@mui/material";
interface RightSideImageProps {
  title: string;
  imgPath: string;
  text: string;
}
export default function RightSideImage({
  title,
  imgPath,
  text,
}: RightSideImageProps) {
  return (
    <>
      <Grid size={{ xs: 0, md: 6 }} sx={{ padding: "1rem" }}>
        <Box
          sx={{
            backgroundImage: `url(${imgPath || `/loginbg.svg`})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: { xs: "none", md: "flex" },
            position: "relative",
            height: "100%",
            borderRadius: "1rem",
            overflow: "hidden",
            alignItems: "flex-end",
            justifyContent: "start",
          }}
        >
          {/* Overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: "rgba(23, 33, 33, 0.3)",
              zIndex: 1,
            }}
          />

          {/* Text content above overlay */}
          <Box m={4} sx={{ position: "relative", zIndex: 2, color: "white" }}>
            <Typography variant="h4" fontWeight="bold">
              {title || "Sign in to Roamhome"}
            </Typography>
            <Typography mt={1}>{text || `Homes as unique as you.`}</Typography>
          </Box>
        </Box>
      </Grid>
    </>
  );
}
