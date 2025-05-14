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
        borderBottom: "1px solid #333",
        backgroundColor: "#181818",
        color: "#f5f5f5",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "center",
          py: 3,
          minHeight: "80px",
        }}
      >
        <Box display="flex" alignItems="center" gap={4}>
          <IconButton
            component={RouterLink}
            to="/"
            color="inherit"
            sx={{
              fontSize: "2rem",
            }}
          >
            <HomeIcon fontSize="inherit" />
          </IconButton>

          <Button
            component={user ? RouterLink : "button"}
            to={user ? "/dashboard" : undefined}
            className="nav-link nav-pink"
            color="inherit"
            sx={{
              fontSize: "1.1rem",
              fontWeight: 500,
              px: 3,
              py: 1.4,
              textTransform: "none",
              opacity: user ? 1 : 0.4,
              pointerEvents: user ? "auto" : "none",
              cursor: user ? "pointer" : "not-allowed",
              backgroundColor: "transparent",
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            My Dashboard
          </Button>

          <Button
            component={RouterLink}
            to="/about"
            className="nav-link nav-yellow"
            color="inherit"
            sx={{
              fontSize: "1.1rem",
              fontWeight: 500,
              px: 3,
              py: 1.4,
              textTransform: "none",
              backgroundColor: "transparent",
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            About
          </Button>

          {user ? (
            <>
              <Typography
                sx={{
                  mx: 1,
                  fontSize: "1rem",
                  fontWeight: 500,
                }}
              >
                Hello, {user.username}!
              </Typography>
              <Button
                onClick={handleLogout}
                className="nav-link nav-green"
                color="inherit"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 500,
                  px: 2,
                  py: 1.2,
                  textTransform: "none",
                  backgroundColor: "transparent",
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              component={RouterLink}
              to="/login"
              className="nav-link nav-green"
              color="inherit"
              sx={{
                fontSize: "1.1rem",
                fontWeight: 500,
                px: 3,
                py: 1.4,
                textTransform: "none",
                backgroundColor: "transparent",
                "&:hover": { backgroundColor: "transparent" },
              }}
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
              fontSize: "2rem",
              opacity: user ? 1 : 0.4,
              pointerEvents: user ? "auto" : "none",
              cursor: user ? "pointer" : "not-allowed",
            }}
          >
            <SentimentSatisfiedAltIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
