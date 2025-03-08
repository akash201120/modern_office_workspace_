import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });

      if (response.data.success) {
        toast.success("Password reset email sent!");
        setSuccess("Check your email for a password reset link.");
        setError(null);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4" style={{ width: "400px" }}>
        <h2 className="text-center">Forgot Password</h2>
        <ToastContainer />
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form onSubmit={handleForgotPassword}>
          <Form.Group controlId="email">
            <Form.Label>Enter your email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100 mt-3">
            Send Reset Link
          </Button>
        </Form>

        <div className="text-center mt-3">
          <Link to="/login">Back to Login</Link>
        </div>
      </Card>
    </Container>
  );
};

export default ForgotPassword;
