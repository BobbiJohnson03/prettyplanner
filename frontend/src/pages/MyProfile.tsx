import React from "react";
import { Typography, Container, Paper, Box } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const MyProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          bgcolor: "#1c1c1c", // Darker paper background
          color: "#f5f5f5", // Light text color
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)", // Subtle shadow
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: 700, mb: 3 }}
        >
          Your Profile
        </Typography>
        {user ? (
          <Box>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>User ID:</strong> {user.id}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Username:</strong> {user.username}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Email:</strong> {user.email}
            </Typography>
            {/* TODO: Add logic here to display and update avatar if implemented */}
            {/* {user.avatarUrl && (
              <Box mt={2}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Avatar:</strong>
                </Typography>
                <img src={user.avatarUrl} alt="User Avatar" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }} />
              </Box>
            )} */}
            {/* TODO: Add "Edit Profile" button and a modal/form for updating profile details */}
          </Box>
        ) : (
          <Typography color="text.secondary" sx={{ textAlign: "center" }}>
            You are not logged in.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default MyProfile;
