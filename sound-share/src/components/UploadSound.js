import { Card, Form, Alert, Button } from "react-bootstrap";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ref, uploadBytes } from "@firebase/storage";
import { storage } from "../firebase-config";
import { v4 } from "uuid";
import { useAuth } from "../contexts/AuthContext";

const UploadSound = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileUpload, setFileUpload] = useState();
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileUpload(e.target.files[0]);
    }
  };

  const uploadFile = async (e) => {
    e.preventDefault();
    if (fileUpload === null) return;

    let date_ob = new Date();
    let day = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    const date = year + "-" + month + "-" + day;

    const username = currentUser.email.split("@")[0];

    const soundRef = ref(
      storage,
      `sounds/${username}/${username + "~" + date + "~" + fileUpload.name}`
    );

    const soundInAllRef = ref(
      storage,
      `sounds/all/${username + "~" + date + "~" + fileUpload.name}`
    );

    try {
      setError("");
      setLoading(true);
      await uploadBytes(soundRef, fileUpload);
      await uploadBytes(soundInAllRef, fileUpload);
      navigate("/sounds");
    } catch (err) {
      console.log(err);
      setError("Could not submit file");
    }
  };

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Upload Sound</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={uploadFile}>
            <Form.Group id="file">
              <Form.Label>File</Form.Label>
              <Form.Control onChange={handleFileChange} type="file" required />
            </Form.Group>

            <Button disabled={loading} className="w-100 mt-4" type="submit">
              Upload
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center-mt-2">
        <Link to="/sounds">Back to sounds</Link>
      </div>
    </>
  );
};

export default UploadSound;
