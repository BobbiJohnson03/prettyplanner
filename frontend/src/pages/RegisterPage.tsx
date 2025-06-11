import React, { useState, ChangeEvent, FormEvent } from "react";
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
import { useRegisterUserMutation } from "../redux/authApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const REGISTER_CHAR_LIMIT = 20;

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords must match!");
      return;
    }

    try {
      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }).unwrap();

      navigate("/login");
    } catch (err: unknown) {
      console.error("Registration error:", err);
      if (typeof err === "object" && err !== null && "data" in err) {
        const fetchError = err as FetchBaseQueryError;
        setError(
          (fetchError.data as { message?: string })?.message ||
            "Registration failed. Please try again."
        );
      } else {
        setError("An unknown error occurred during registration.");
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
          Register
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField
            name="username"
            label="Username"
            fullWidth
            value={formData.username}
            onChange={handleChange}
            required
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{
              style: { color: "#f5f5f5" },
              inputProps: { maxLength: REGISTER_CHAR_LIMIT },
            }}
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
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            required
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{
              style: { color: "#f5f5f5" },
              inputProps: { maxLength: REGISTER_CHAR_LIMIT },
            }}
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
            name="password"
            label="Password"
            type="password"
            fullWidth
            value={formData.password}
            onChange={handleChange}
            required
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{
              style: { color: "#f5f5f5" },
              inputProps: { maxLength: REGISTER_CHAR_LIMIT },
            }}
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
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            fullWidth
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{
              style: { color: "#f5f5f5" },
              inputProps: { maxLength: REGISTER_CHAR_LIMIT },
            }}
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
          {error && (
            <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
              {error}
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
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </form>
        <Typography sx={{ mt: 3, textAlign: "center", color: "#aaaaaa" }}>
          Already have an account?{" "}
          <Link
            component={RouterLink}
            to="/login"
            underline="hover"
            color="primary"
            sx={{ fontWeight: 600 }}
          >
            Log in
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
