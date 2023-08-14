import { Routes, Route, Navigate } from "react-router-dom";
import Videos from "./assets/Pages/Videos";
import Register from "./assets/Pages/Register";
import Login from "./assets/Pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import NavBar from "./assets/components/NavBar";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import VideoDetail from "./assets/Pages/VideoDetail";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <>
      <NavBar />
      <Container>
        <Routes>
          <Route path="/" element={user ? <Videos /> : <Login />} />
          <Route path="/register" element={user ? <Videos /> : <Register />} />
          <Route path="/login" element={user ? <Videos /> : <Login />} />
          <Route
            path="/videos/:id"
            element={user ? <VideoDetail /> : <Login />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
