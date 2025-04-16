import React, { useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../redux/authSlice";
import { RootState, AppDispatch } from "../redux/store";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((state: RootState) => state.auth?.user);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(clearUser());
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: "1px solid #eaeaea",
        backgroundColor: "#ffffff",
      }}
    >
      <Toolbar sx={{ justifyContent: "center", py: 2 }}>
        <Box display="flex" alignItems="center" gap={1}></Box>

        <Box display="flex" alignItems="center" gap={2}>
          <IconButton component={RouterLink} to="/" color="inherit">
            <HomeIcon />
          </IconButton>
          <Button
            component={RouterLink}
            to="/dashboard"
            className="nav-link nav-pink"
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            My Dashboard
          </Button>

          <Button
            component={RouterLink}
            to="/about"
            className="nav-link nav-yellow"
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            About
          </Button>

          {user ? (
            <>
              <Typography sx={{ mx: 1, fontWeight: 500 }}>
                Hello, {user.username}!
              </Typography>
              <Button
                color="inherit"
                onClick={handleLogout}
                className="nav-link nav-green"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              component={RouterLink}
              to="/login"
              color="inherit"
              className="nav-link nav-green"
            >
              Login
            </Button>
          )}

          <IconButton
            color="inherit"
            component={user ? RouterLink : "button"}
            to={user ? "/profile" : undefined}
            disabled={!user}
            sx={{
              opacity: user ? 1 : 0.4,
              pointerEvents: user ? "auto" : "none",
              cursor: user ? "pointer" : "not-allowed",
            }}
          >
            <SentimentSatisfiedAltIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
