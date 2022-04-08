import { Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const UpdateProfile = () => {
  const { currentUser, handleUpdateEmail, handleUpdatePassword } = useAuth();
  const navigate = useNavigate();

  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = passwordConfirmRef.current.value;

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (
      (0 < password.length && password.length < 6) ||
      (1 < confirmPassword.length && confirmPassword.length < 6)
    ) {
      return setError("Password should be at least 6 characters");
    }

    const promises = [];

    setError("");
    setLoading(true);

    // add email update promise if email changed
    if (email !== currentUser.email) {
      promises.push(handleUpdateEmail(email));
    }

    // add pass update promise if new password entered
    if (password) {
      promises.push(handleUpdatePassword(password));
    }

    // try fulfilling all promises (update email/pass)
    try {
      await Promise.all(promises);
      navigate("/");
    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Email already in use");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;

        default:
          setError("Failed to create an account");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Update Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                defaultValue={currentUser.email}
                type="email"
                ref={emailRef}
                required
              />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                placeholder="Leave blank to keep the same"
                type="password"
                ref={passwordRef}
              />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control
                placeholder="Leave blank to keep the same"
                type="password"
                ref={passwordConfirmRef}
              />
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-4" type="submit">
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link to="/">Cancel</Link>
      </div>
    </>
  );
};

export default UpdateProfile;
