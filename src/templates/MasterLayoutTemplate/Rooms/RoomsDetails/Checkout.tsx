import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { axiosInstance } from "../../../../services/axiosInstance";
import { PORTAL_URLS } from "../../../../services/apiEndpoints";

type Booking = {
  _id: string;
  startDate?: string;
  endDate?: string;
  totalPrice?: number;
  room?: { roomNumber?: string };
  status?: string;
  isPaid?: boolean;
  paid?: boolean;
};

function getRawToken(): string {
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

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "string") raw = parsed;
    else if (parsed?.token) raw = parsed.token;
    else if (parsed?.accessToken) raw = parsed.accessToken;
  } catch {}

  const cleaned = String(raw).replace(/^"+|"+$/g, "").trim();
  if (!cleaned) return "";

  return cleaned.replace(/^Bearer\s+/i, "").trim();
}

function makeAuthHeaders() {
  const t = getRawToken();
  if (!t) return null;

  return {
    Authorization: `Bearer ${t}`,
    token: `Bearer ${t}`,
    "x-access-token": t,
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

function StepBubbles({ step }: { step: 1 | 2 | 3 }) {
  const PRIMARY = "#1ABC9C";

  const isDone = (i: number) => i < step;
  const isActive = (i: number) => i === step;

  const Bubble = ({ i }: { i: 1 | 2 | 3 }) => {
    const done = isDone(i);
    const active = isActive(i);

    if (done) {
      return <CheckCircleRoundedIcon sx={{ fontSize: 36, color: PRIMARY }} />;
    }

    return (
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "3px solid",
          borderColor: active ? PRIMARY : "#cfd8dc",
          display: "grid",
          placeItems: "center",
          color: active ? PRIMARY : "#90a4ae",
          fontSize: 16,
          fontWeight: 900,
          bgcolor: "#fff",
        }}
      >
        {i}
      </Box>
    );
  };

  const Line = ({ filled }: { filled: boolean }) => (
    <Box
      sx={{
        width: 110,
        height: 4,
        bgcolor: filled ? PRIMARY : "#e3f2fd",
        borderRadius: 999,
      }}
    />
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mb: { xs: 3, md: 3.5 },
      }}
    >
      <Bubble i={1} />
      <Line filled={step > 1} />
      <Bubble i={2} />
      <Line filled={step > 2} />
      <Bubble i={3} />
    </Box>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        width: "100%",
        bgcolor: "#fff",
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          minHeight: "100dvh",
          width: "100%",
          px: { xs: 2, sm: 3.5, md: 6 },
          py: { xs: 2, md: 4 },
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1280,
            mx: "auto",
            bgcolor: "#fff",
            borderRadius: 2,
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
            border: "1px solid #eef2f7",
            p: { xs: 2, md: 4 },
            boxSizing: "border-box",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default function Checkout() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loadingBooking, setLoadingBooking] = useState(true);

  const [step, setStep] = useState<1 | 2 | 3>(2);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  type CompletionMode = "success" | "already_paid";
  const [completionMode, setCompletionMode] =
    useState<CompletionMode>("success");

  const payLockRef = useRef(false);

  const headers = useMemo(() => makeAuthHeaders(), []);
  const isLoggedIn = !!headers;

  // ✅ Always open from TOP (no auto-scroll to Step 2)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, [bookingId]);

  const markAsPaidUI = (mode: CompletionMode) => {
    setCompletionMode(mode);
    setPaid(true);
    setStep(3);
    setPaying(false);
    payLockRef.current = false;
  };

  const isServerPaid = (b: any) => {
    if (!b) return false;
    return (
      b?.isPaid === true ||
      b?.paid === true ||
      String(b?.status || "").toLowerCase() === "paid" ||
      String(b?.status || "").toLowerCase() === "completed"
    );
  };

  useEffect(() => {
    const run = async () => {
      if (!bookingId || !headers) {
        setLoadingBooking(false);
        return;
      }

      setLoadingBooking(true);
      try {
        const res = await axiosInstance.get(
          PORTAL_URLS.BOOKING.GET_BOOKING(bookingId),
          { headers }
        );

        const b = res.data?.data?.booking || res.data?.data || res.data?.booking;
        setBooking(b ?? null);

        // If already paid -> go Step 3 with "already paid" message
        if (isServerPaid(b)) {
          markAsPaidUI("already_paid");
        }
      } catch (e: any) {
        console.log("GET BOOKING ERROR:", e?.response?.data || e?.message);
        setBooking(null);
      } finally {
        setLoadingBooking(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const totalToPay = booking?.totalPrice ?? 0;

  const canPay =
    !!bookingId &&
    isLoggedIn &&
    !loadingBooking &&
    !paying &&
    !paid &&
    !!stripe &&
    !!elements;

  const handlePay = async () => {
    if (payLockRef.current) return;
    payLockRef.current = true;

    if (paying) {
      payLockRef.current = false;
      return;
    }
    if (!bookingId) {
      payLockRef.current = false;
      return alert("Missing bookingId.");
    }
    if (!headers) {
      payLockRef.current = false;
      return alert("Token is required. Please log in again.");
    }

    // Optional: if booking already paid in UI state, prevent extra calls
    if (isServerPaid(booking)) {
      markAsPaidUI("already_paid");
      return;
    }

    if (!stripe || !elements) {
      payLockRef.current = false;
      return alert("Stripe is not ready yet.");
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      payLockRef.current = false;
      return alert("Card element not found.");
    }

    setPaying(true);

    try {
      const { token, error } = await stripe.createToken(card as any);
      if (error || !token) {
        throw new Error(error?.message || "Failed to create Stripe token.");
      }

      const payRes = await axiosInstance.post(
        PORTAL_URLS.BOOKING.PAY(bookingId),
        { token: token.id },
        { headers }
      );

      // Sometimes backend might return redirect URL
      const payUrl =
        payRes.data?.data?.url ||
        payRes.data?.url ||
        payRes.data?.data?.checkoutUrl ||
        payRes.data?.checkoutUrl;

      if (payUrl) {
        window.location.href = payUrl;
        return;
      }

      // If backend returns success and booking object, treat as paid
      markAsPaidUI("success");
    } catch (e: any) {
      const msg = String(e?.response?.data?.message || e?.message || "Payment failed.");

      // Token reuse / already paid / completed
      const lower = msg.toLowerCase();
      const looksLikeAlreadyPaid =
        lower.includes("cannot use a stripe token more than once") ||
        lower.includes("already paid") ||
        lower.includes("already completed") ||
        lower.includes("payment has been completed");

      if (looksLikeAlreadyPaid) {
        // Re-check booking status from server: if paid -> show step 3 already paid
        try {
          const res = await axiosInstance.get(
            PORTAL_URLS.BOOKING.GET_BOOKING(bookingId),
            { headers }
          );
          const b = res.data?.data?.booking || res.data?.data || res.data?.booking;
          setBooking(b ?? null);

          if (isServerPaid(b)) {
            markAsPaidUI("already_paid");
            return;
          }
        } catch {
          // ignore and still show already paid (UX)
        }

        markAsPaidUI("already_paid");
        return;
      }

      alert(msg);
    } finally {
      setPaying(false);
      payLockRef.current = false;
    }
  };

  if (!bookingId) {
    return (
      <PageShell>
        <Typography color="error">Missing bookingId in URL</Typography>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Box sx={{ position: "relative" }}>
        {/* Close */}
        <Box sx={{ position: "absolute", right: 0, top: 0 }}>
          <Button
            onClick={() => navigate("/")}
            startIcon={<CloseRoundedIcon />}
            sx={{ color: "#90a4ae" }}
          >
            Close
          </Button>
        </Box>

        {/* Spacer so button doesn't overlap */}
        <Box sx={{ pt: { xs: 4, md: 2 } }}>
          <StepBubbles step={step} />

          <Typography variant="h4" fontWeight={900} textAlign="center" sx={{ mb: 1 }}>
            Payment
          </Typography>

          <Typography textAlign="center" color="text.secondary" sx={{ mb: { xs: 3, md: 4 } }}>
            Kindly follow the instructions below.
          </Typography>

          {step === 3 ? (
            <Box sx={{ textAlign: "center", py: { xs: 3, md: 5 } }}>
              <Typography variant="h5" fontWeight={900} sx={{ mb: 1 }}>
                {completionMode === "already_paid"
                  ? "Payment Already Completed ✅"
                  : "Payment Successful ✅"}
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {completionMode === "already_paid"
                  ? "This booking has already been paid. You do not need to pay again."
                  : "We received your payment. You will receive an email once the transaction is confirmed."}
              </Typography>

              <Box
                component="img"
                src={completionMode === "already_paid" ? "/paid-already.png" : "/payment.png"}
                alt="Payment illustration"
                sx={{
                  width: { xs: 240, md: 340 },
                  height: { xs: 150, md: 210 },
                  mx: "auto",
                  mb: 3,
                  borderRadius: 3,
                  bgcolor: "#eef6ff",
                  border: "1px solid #e3f2fd",
                  objectFit: "cover",
                  display: "block",
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/payment.png";
                }}
              />

              <Button
                variant="contained"
                onClick={() => navigate("/")}
                sx={{ px: 5, borderRadius: 2 }}
              >
                Back to home
              </Button>
            </Box>
          ) : (
            <>
              <Divider sx={{ mb: { xs: 3, md: 4 } }} />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: { xs: 3, md: 6 },
                  alignItems: "start",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                {/* Left */}
                <Box sx={{ minWidth: 0 }}>
                  <Typography fontWeight={900} sx={{ mb: 2 }}>
                    Booking Summary
                  </Typography>

                  {loadingBooking ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <CircularProgress size={18} />
                      <Typography color="text.secondary">
                        Loading booking details…
                      </Typography>
                    </Box>
                  ) : booking ? (
                    <Stack spacing={1.2} sx={{ minWidth: 0 }}>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ wordBreak: "break-word" }}
                      >
                        Booking ID: <b>{bookingId}</b>
                      </Typography>

                      <Typography variant="body1">
                        Start: <b>{fmtDate(booking.startDate)}</b>
                      </Typography>

                      <Typography variant="body1">
                        End: <b>{fmtDate(booking.endDate)}</b>
                      </Typography>

                      {booking?.room?.roomNumber && (
                        <Typography variant="body1" color="text.secondary">
                          Room: <b>{booking.room.roomNumber}</b>
                        </Typography>
                      )}

                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Total:
                        </Typography>
                        <Typography variant="h4" fontWeight={900}>
                          ${totalToPay}
                        </Typography>
                      </Box>
                    </Stack>
                  ) : (
                    <Typography color="error">
                      Could not load booking details. (Check endpoint + token)
                    </Typography>
                  )}
                </Box>

                {/* Right */}
                <Box sx={{ minWidth: 0 }}>
                  <Typography fontWeight={900} sx={{ mb: 2 }}>
                    Payment Details
                  </Typography>

                  <Box
                    sx={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 2,
                      p: 2,
                      mb: 2.5,
                      bgcolor: "#fff",
                      minWidth: 0,
                    }}
                  >
                    <CardElement
                      options={{
                        hidePostalCode: true,
                        style: { base: { fontSize: "16px" } },
                      }}
                    />
                  </Box>

                  {!isLoggedIn && (
                    <Typography
                      color="text.secondary"
                      sx={{ mb: 1.5, fontStyle: "italic" }}
                    >
                      Please log in first to continue.
                    </Typography>
                  )}

                  {!stripe || !elements ? (
                    <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                      Stripe is still initializing…
                    </Typography>
                  ) : null}

                  <Button
                    variant="contained"
                    onClick={handlePay}
                    disabled={!canPay}
                    sx={{
                      height: 48,
                      borderRadius: 2,
                      fontWeight: 900,
                      width: "100%",
                      fontSize: 16,
                    }}
                  >
                    {paying ? (
                      <CircularProgress size={22} color="inherit" />
                    ) : (
                      "Pay"
                    )}
                  </Button>

                  <Button
                    variant="text"
                    onClick={() => navigate(-1)}
                    sx={{
                      mt: 1.5,
                      color: "#90a4ae",
                      fontWeight: 800,
                      width: "100%",
                      fontSize: 14,
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ mt: { xs: 3, md: 4 }, mb: 2 }} />

              <Typography color="text.secondary" variant="body2">
                Step 2: Enter card details and press Pay (press once).
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </PageShell>
  );
}

