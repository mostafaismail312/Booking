import { Typography, Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

interface AuthHeaderProps {
  header: string;
  message: string;
  linkName: string;
  link: string;
}
export default function AuhtHeader({
  header,
  message,
  linkName,
  link,
}: AuthHeaderProps) {
  return (
    <>
      <Typography
        fontStyle={"capitalize"}
        fontSize={"30px"}
        variant="h4"
        fontWeight={500}
        mb={2}
      >
        {header}
      </Typography>

      {message && link && (
        <Typography
          variant="body2"
          mb={2}
          sx={{ fontSize: "16px", color: "text.primary" }}
        >
          {message}
          <MuiLink
            component={RouterLink}
            to={link}
            sx={{
              ml: 1,
              fontWeight: "600",
              textDecoration: "none",
              color: "var(--dark-blue-color)",
            }}
          >
            {linkName || "Click here"}
          </MuiLink>
        </Typography>
      )}
    </>
  );
}
