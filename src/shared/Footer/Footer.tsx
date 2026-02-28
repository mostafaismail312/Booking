import {
  Box,
  Grid,
  Typography
} from "@mui/material";
import { styled } from "@mui/material/styles";
import logoMain from '/color-logo-Ci_5FMX-.svg';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  borderTop: "1px solid #E5E5E5",
  padding: "60px 40px 30px 40px",
}));

const FooterTitle = styled(Typography)({
  fontWeight: 600,
  color: "#152C5B",
  marginBottom: 16,
  fontSize: "19px",
});

const FooterText = styled(Typography)({
  color: "#B8B8B8",
  marginTop: 8,
  marginBottom: 8,
  fontSize: "16px",
});

export default function Footer() {
  return (

      <FooterContainer>
            <Box px={{ xs: 2, sm: 4, md: 8, lg: 20 }} py={2}>

        <Grid container spacing={4}>
          {/* Logo */}
          <Grid {...{ item: true, xs: 12, md: 3 }}>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box sx={{mr:"40px"}}>
              <Box component="img" src={logoMain} alt="Staycation Logo" sx={{ width: 150}} />
              <FooterText >
                We kaboom your beauty holiday instantly and memorable.
              </FooterText>
              </Box>
            </Box>
          </Grid>

          {/* Sections */}
          <Grid {...{ item: true, xs: 12, md: 9 }}>
            <Grid
              container
              justifyContent="space-between"
              wrap="wrap"
            >
              <Grid
                {...{ item: true }}
                sx={{
                  width: { xs: '100%', md: "320px" },
                  mt: { xs: 4, md: 0 },
                }}
              >
                <FooterTitle>For Beginners</FooterTitle>
                <FooterText>New Account</FooterText>
                <FooterText>Start Booking a Room</FooterText>
                <FooterText>Use Payments</FooterText>
              </Grid>

              <Grid
                {...{ item: true }}
                sx={{
                  width: { xs: '100%', md: '320px' },
                  mt: { xs: 4, md: 0 },
                }}
              >
                <FooterTitle>Explore Us</FooterTitle>
                <FooterText>Our Careers</FooterText>
                <FooterText>Privacy</FooterText>
                <FooterText>Terms & Conditions</FooterText>
              </Grid>

              <Grid
                {...{ item: true }}
                sx={{
                  width: { xs: '100%', md: '320px' },
                  mt: { xs: 4, md: 0 },
                }}
              >
                <FooterTitle>Connect Us</FooterTitle>
                <FooterText>support@staycation.id</FooterText>
                <FooterText>021 - 2208 - 1996</FooterText>
                <FooterText>Staycation, Kemang, Jakarta</FooterText>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box mt={10} textAlign="center">
          <Typography variant="body2" color="#A0AEC0">
            Copyright 2025 · All rights reserved · Staycation
          </Typography>
        </Box>      
          </Box>

      </FooterContainer>
  );
}
