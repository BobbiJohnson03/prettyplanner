import React, { useState, FormEvent } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Link,
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

    try {
      const response = await loginUser({ email, password }).unwrap();
      const { token, user } = response;

      if (!token) {
        setMessage("Token is missing from the response.");
        return;
      }

      localStorage.setItem("token", token);
      dispatch(setUser({ user, token }));
      navigate("/");
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "data" in error) {
        const err = error as FetchBaseQueryError;
        setMessage(
          (err.data as { message?: string })?.message ||
            "Nieprawidłowy email lub hasło."
        );
      } else {
        setMessage("Wystąpił nieznany błąd.");
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          mt: 10,
          p: 4,
          borderRadius: 3,
          bgcolor: "background.paper",
          color: "text.primary",
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
          Logowanie
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#f5f5f5" } }}
          />
          <TextField
            label="Hasło"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#f5f5f5" } }}
          />
          {message && (
            <Typography color="error" sx={{ mb: 2 }}>
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
          >
            {isLoading ? "Logowanie..." : "Zaloguj się"}
          </Button>
        </form>
        <Typography sx={{ mt: 2, textAlign: "center", color: "text.secondary" }}>
          Nie masz konta?{" "}
          <Link
            component={RouterLink}
            to="/register"
            underline="hover"
            color="primary"
          >
            Zarejestruj się
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default LoginPage;
