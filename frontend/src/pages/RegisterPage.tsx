import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Link,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useRegisterUserMutation } from "../redux/authApi";
//import { useAppSelector, useAppDispatch } from "../redux/hooks";

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [registerUser] = useRegisterUserMutation();
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
    if (formData.password !== formData.confirmPassword) {
      setError("Hasła muszą być takie same!");
      return;
    }
    try {
      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }).unwrap();

      navigate("/login");
    } catch (error) {
      console.error("Błąd rejestracji:", error);
      setError("Nie udało się zarejestrować. Spróbuj ponownie.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{ mt: 10, p: 4, borderRadius: 3, backgroundColor: "#fff" }}
      >
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
          Rejestracja
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField
            name="username"
            label="Nazwa użytkownika"
            fullWidth
            value={formData.username}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            name="email"
            label="Email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            name="password"
            label="Hasło"
            type="password"
            fullWidth
            value={formData.password}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            name="confirmPassword"
            label="Powtórz hasło"
            type="password"
            fullWidth
            value={formData.confirmPassword}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
          >
            Zarejestruj się
          </Button>
        </form>
        <Typography sx={{ mt: 2, textAlign: "center" }}>
          Masz już konto?{" "}
          <Link
            component={RouterLink}
            to="/login"
            underline="hover"
            color="primary"
          >
            Zaloguj się
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
