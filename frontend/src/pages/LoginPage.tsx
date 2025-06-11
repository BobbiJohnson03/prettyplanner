import React, { useState, FormEvent } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Link,
  Box,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useLoginUserMutation } from "../redux/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await loginUser({ email, password }).unwrap();
      const { token, user } = response;

      if (!token) {
        setMessage("Token is missing from the response.");
        return;
      }

      dispatch(setUser({ user, token }));
      navigate("/");
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "data" in error) {
        const err = error as FetchBaseQueryError;
        setMessage(
          (err.data as { message?: string })?.message ||
            "Invalid email or password. Please try again."
        );
      } else {
        setMessage("An unknown error occurred during login.");
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          bgcolor: "#1c1c1c",
          color: "#f5f5f5",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Typography
          variant="h4"
          sx={{ mb: 3, textAlign: "center", fontWeight: 700 }}
        >
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#f5f5f5" } }}
            variant="outlined"
            size="medium"
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#555" },
                "&:hover fieldset": { borderColor: "#888" },
                "&.Mui-focused fieldset": { borderColor: "#90caf9" },
              },
            }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#f5f5f5" } }}
            variant="outlined"
            size="medium"
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#555" },
                "&:hover fieldset": { borderColor: "#888" },
                "&.Mui-focused fieldset": { borderColor: "#90caf9" },
              },
            }}
          />
          {message && (
            <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
              {message}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={isLoading}
            sx={{
              mt: 2,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: 600,
              backgroundColor: "#90caf9",
              "&:hover": { backgroundColor: "#64b5f6" },
            }}
          >
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
        </form>
        <Typography sx={{ mt: 3, textAlign: "center", color: "#aaaaaa" }}>
          Don’t have an account?{" "}
          <Link
            component={RouterLink}
            to="/register"
            underline="hover"
            color="primary"
            sx={{ fontWeight: 600 }}
          >
            Register
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default LoginPage;
