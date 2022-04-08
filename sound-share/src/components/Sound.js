import { memo } from "react";
import { Card } from "react-bootstrap";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useAuth } from "../contexts/AuthContext";

const Sound = memo(({ url, username, filename, date }) => {
  const { currentUser } = useAuth();

  return (
    <>
      <Card>
        <Card.Body>
          <h3>{filename}</h3>
          <p>
            {username} | {date}
          </p>
          <audio controls>
            <source src={url} />
          </audio>
        </Card.Body>
      </Card>
    </>
  );
});

export default Sound;
