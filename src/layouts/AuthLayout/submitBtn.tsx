import { Box, Button, CircularProgress } from "@mui/material";

const SubmitBtn = ({
  isSubmitting,
  title,
  size,
  smallWidth = false,
  
}: {
  isSubmitting: boolean;
  title: string;
  smallWidth?: boolean;
  size?: "large" | "medium" | "small";
  
}) => {
  return (
    <Button
      type="submit"
      fullWidth={!smallWidth}
      size={size || "large"}
      variant="contained"
      sx={{ bgcolor: "#3252DF", borderRadius: "5px", marginTop: "2rem" }}
      disabled={isSubmitting}
    >
      {(isSubmitting && (
        <Box sx={{ display: "flex" }}>
          <CircularProgress size="30px" />
        </Box>
      )) ||
        title}
    </Button>
  );
};

export default SubmitBtn;
