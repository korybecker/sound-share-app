import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase-config";
import { Card, Container, Alert, Button } from "react-bootstrap";

import Sound from "./Sound";

const Dashboard = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [soundsList, setSoundsList] = useState([]);

  const { currentUser, logout } = useAuth();
  const soundsListRef = ref(
    storage,
    `sounds/${currentUser.email.split("@")[0]}`
  );

  const handleLogout = async () => {
    setError("");
    try {
      await logout();
      navigate("/login");
    } catch (err) {}
  };

  useEffect(() => {
    let isCancelled = false;
    const getSounds = async () => {
      try {
        const response = await listAll(soundsListRef);
        if (!isCancelled) {
          response.items.forEach((item) => {
            const username = item.fullPath.split("/")[2].split("~")[0];
            const date = item.fullPath.split("/")[2].split("~")[1];
            const filename = item.fullPath.split("/")[2].split("~")[2];
            getDownloadURL(item)
              .then((url) => {
                setSoundsList((prev) => [
                  ...prev,
                  { url, username, date, filename },
                ]);
              })
              .catch((err) => console.log(err));
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    getSounds();
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email: </strong> {currentUser.email}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
      <Container className="w-200">
        <Card className="w-200">
          <Card.Body className="w-200">
            <h2 className="text-center mb-4">My Sounds</h2>

            {soundsList.map((sound, i) => {
              return (
                <Sound
                  key={i}
                  url={sound.url}
                  username={sound.username}
                  date={sound.date}
                  filename={sound.filename}
                />
              );
            })}
          </Card.Body>
        </Card>
        <div className="w-100 text-center-mt-2">
          <Link to="/upload-sound">Upload sound</Link>
        </div>
      </Container>
    </>
  );
};

export default Dashboard;
