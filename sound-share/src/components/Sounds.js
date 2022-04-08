import { storage } from "../firebase-config";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Sound from "./Sound";
import { useAuth } from "../contexts/AuthContext";

const Sounds = () => {
  const [soundsList, setSoundsList] = useState([]);
  const soundsListRef = ref(storage, "sounds/all/");
  const { currentUser } = useAuth();

  useEffect(() => {
    let isCancelled = false;

    const getSounds = async () => {
      try {
        const response = await listAll(soundsListRef);
        if (!isCancelled) {
          response.items.forEach((item) => {
            console.log(item.fullPath);
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

    // CLEANUP FUNCTION
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <>
      <Container className="w-200">
        <Card className="w-200">
          <Card.Body className="w-200">
            <h2 className="text-center mb-4">Sounds</h2>

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
          {currentUser && <Link to="/upload-sound">Upload sound</Link>}
        </div>
      </Container>
    </>
  );
};

export default Sounds;
