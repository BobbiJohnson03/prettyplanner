import React from "react";
import { Typography, Container, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store"; // Make sure you have this type

const MyProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom>
          Twój profil
        </Typography>
        {user ? (
          <>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Imię:</strong> {user.username}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Email:</strong> {user.email}
            </Typography>
          </>
        ) : (
          <Typography color="text.secondary">
            Nie jesteś zalogowany(a).
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default MyProfile;
