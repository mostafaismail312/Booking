import { Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <>
      {/* Logo in Top-Left */}
      <Box
        component={Link}
        to={"/login"}
        sx={{
          position: {
            xs: "static",
            md: "absolute",
          },
          top: {
            md: "3rem",
          },
          left: {
            md: "3rem",
          },
          width: {
            xs: "100%",
            md: "auto",
          },
          textAlign: {
            xs: "center",
            md: "left",
          },
          fontSize: "26px",
          fontWeight: 500,
          textDecoration: "none",
        }}
      >
        <span style={{ color: "#3252DF" }}>Stay</span>
        <span style={{ color: "#152C5B" }}>cation.</span>
      </Box>
    </>
  );
}
