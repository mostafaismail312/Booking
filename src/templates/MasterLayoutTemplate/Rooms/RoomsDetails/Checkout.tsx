import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import { axiosInstance } from "../../../../services/axiosInstance";
import { PORTAL_URLS } from "../../../../services/apiEndpoints";

type Booking = {
  _id: string;
  startDate?: string; // ISO
  endDate?: string; // ISO
  totalPrice?: number;
  room?: {
    _id?: string;
    roomNumber?: string;
    price?: number;
    discount?: number;
    images?: string[];
  };
};

function getJwtTokenOnly(): string {
  const keys = ["token", "accessToken", "authToken"];
  let raw = "";

  for (const k of keys) {
    const v = localStorage.getItem(k);
    if (v) {
      raw = v;
      break;
    }
  }
  if (!raw) return "";

  // handle JSON stored token: {"token":"Bearer ..."} OR "\"Bearer ...\""
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "string") raw = parsed;
    else if (parsed?.token) raw = parsed.token;
    else if (parsed?.accessToken) raw = parsed.accessToken;
  } catch {
    // not JSON
  }

  const cleaned = String(raw).replace(/^"+|"+$/g, "").trim();
  if (!cleaned) return "";

  // return JWT only (no Bearer)
  return cleaned.replace(/^Bearer\s+/i, "").trim();
}

function buildAuthHeaders(jwt: string) {
  // Many backends accept Authorization, some accept token, some accept x-access-token.
  // Also: some expect token header to contain Bearer prefix.
  const bearer = `Bearer ${jwt}`;

  return {
    Authorization: bearer,
    token: bearer,
    "x-access-token": bearer,
  };
}

function fmtDate(iso?: string) {
  if (!iso) return "--";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function calcNights(start?: string, end?: string) {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return 0;
  const ms = e.getTime() - s.getTime();
  if (ms <= 0) return 0;

  // nights based on days difference (min 1)
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return Math.max(1, days);
}

export default function Checkout() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [paying, setPaying] = useState(false);

  // ✅ Success Dialog state
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string>("Payment succeeded ✅");

  // ✅ read JWT once (no Bearer)
  const jwt = useMemo(() => getJwtTokenOnly(), []);
  const isLoggedIn = !!jwt;

  // ✅ Fetch booking details
  useEffect(() => {
    const run = async () => {
      if (!bookingId) {
        setLoadingBooking(false);
        return;
      }

      if (!jwt) {
        setLoadingBooking(false);
        return;
      }

      setLoadingBooking(true);

      try {
        const res = await axiosInstance.get(
          PORTAL_URLS.BOOKING.GET_BOOKING(bookingId),
          { headers: buildAuthHeaders(jwt) }
        );

        const b = res.data?.data?.booking || res.data?.data || res.data?.booking;
        setBooking(b ?? null);
      } catch (e: any) {
        console.log("GET BOOKING DETAILS ERROR:", e?.response?.data || e?.message);
        setBooking(null);
      } finally {
        setLoadingBooking(false);
      }
    };

    run();
  }, [bookingId, jwt]);

  const nights = calcNights(booking?.startDate, booking?.endDate);
  const totalToPay = booking?.totalPrice ?? 0;

  const canPay =
    !!bookingId &&
    isLoggedIn &&
    !!booking &&
    !loadingBooking &&
    !paying &&
    !!stripe &&
    !!elements;

  const handlePay = async () => {
    if (!bookingId) return alert("Missing bookingId");
    if (!jwt) return alert("Login token is missing — اعملي login تاني");
    if (!stripe || !elements) return alert("Stripe not ready");

    const card = elements.getElement(CardElement);
    if (!card) return alert("Card element not found");

    setPaying(true);

    try {
      // 1) Stripe tokenization -> tok_...
      const { token, error } = await stripe.createToken(card as any);

      if (error || !token) {
        throw new Error(error?.message || "Failed to create stripe token");
      }

      // 2) Pay booking
      // ✅ IMPORTANT: backend expects body { token: "tok_..." } (as per your Postman screenshot)
      const payRes = await axiosInstance.post(
        PORTAL_URLS.BOOKING.PAY(bookingId),
        { token: token.id },
        { headers: buildAuthHeaders(jwt) }
      );

      // 3) Redirect if backend returns checkout url (optional flow)
      const payUrl =
        payRes.data?.data?.url ||
        payRes.data?.url ||
        payRes.data?.data?.checkoutUrl ||
        payRes.data?.checkoutUrl;

      if (payUrl) {
        window.location.href = payUrl;
        return;
      }

      // 4) No redirect URL -> treat as success (server-side charge/payment)
      const status =
        payRes.data?.data?.status ||
        payRes.data?.status ||
        payRes.data?.data?.paymentStatus;

      setSuccessMsg(
        status ? `Payment succeeded ✅ (status: ${status})` : "Payment succeeded ✅"
      );
      setSuccessOpen(true);
    } catch (e: any) {
      console.log("PAY ERROR:", e?.response?.data || e?.message);
      alert(e?.response?.data?.message || e?.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 5, px: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h5" fontWeight={700}>
          Checkout
        </Typography>

        {!bookingId && (
          <Paper sx={{ p: 2, border: "1px solid #eee" }}>
            <Typography color="error">Missing bookingId in URL</Typography>
          </Paper>
        )}

        {!isLoggedIn && (
          <Paper sx={{ p: 2, border: "1px solid #eee" }}>
            <Typography color="text.secondary">Please login first to continue.</Typography>
          </Paper>
        )}

        {/* Booking Summary */}
        <Paper sx={{ p: 2.5, border: "1px solid #eee" }}>
          <Typography fontWeight={700} sx={{ mb: 1 }}>
            Booking Summary
          </Typography>

          {loadingBooking ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <CircularProgress size={20} />
              <Typography color="text.secondary">Loading booking details…</Typography>
            </Box>
          ) : booking ? (
            <Stack spacing={1}>
              <Typography color="text.secondary">
                Booking ID: <b>{bookingId}</b>
              </Typography>

              <Divider />

              <Typography>
                Start: <b>{fmtDate(booking.startDate)}</b>
              </Typography>
              <Typography>
                End: <b>{fmtDate(booking.endDate)}</b>
              </Typography>

              <Typography>
                Nights: <b>{nights || "--"}</b>
              </Typography>

              <Typography variant="h6" sx={{ mt: 1 }}>
                Total to pay: <b>${totalToPay}</b>
              </Typography>

              {booking?.room?.roomNumber && (
                <Typography color="text.secondary">
                  Room: <b>{booking.room.roomNumber}</b>
                </Typography>
              )}
            </Stack>
          ) : (
            <Typography color="error">
              Could not load booking details. (Check endpoint + token)
            </Typography>
          )}
        </Paper>

        {/* Card + Pay */}
        <Paper sx={{ p: 2.5, border: "1px solid #eee" }}>
          <Typography fontWeight={700} sx={{ mb: 1 }}>
            Payment Details
          </Typography>

          <Box
            sx={{
              border: "1px solid #ddd",
              borderRadius: 2,
              p: 2,
              mb: 2,
            }}
          >
            <CardElement options={{ hidePostalCode: true }} />
          </Box>

          <Button
            variant="contained"
            onClick={handlePay}
            disabled={!canPay}
            sx={{ width: { xs: "100%", sm: 240 } }}
          >
            {paying ? <CircularProgress size={22} color="inherit" /> : "Pay"}
          </Button>

          {!stripe || !elements ? (
            <Typography sx={{ mt: 1.5 }} color="text.secondary">
              Stripe is still initializing…
            </Typography>
          ) : null}
        </Paper>

        {/* ✅ Success Dialog */}
        <Dialog
          open={successOpen}
          onClose={() => setSuccessOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Payment Successful</DialogTitle>

          <DialogContent>
            <Typography sx={{ mt: 0.5 }} color="text.secondary">
              {successMsg}
            </Typography>

            <Typography sx={{ mt: 1.5 }}>
              Booking ID: <b>{bookingId}</b>
            </Typography>

            <Typography>
              Total paid: <b>${totalToPay}</b>
            </Typography>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setSuccessOpen(false)}>Close</Button>

            <Button
              variant="contained"
              onClick={() => {
                setSuccessOpen(false);
                navigate("/roomsexplore");
              }}
            >
              Back to Explore
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
}


