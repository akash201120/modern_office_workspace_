import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const response = await axios.post("https://modern-office-workspace-hrv9.onrender.com/api/auth/signup", {
        name,
        email,
        password,
        role,
      });

      if (response.data.success) {
        setMessage("Signup successful! Check your email for the verification code.");
        localStorage.setItem("userEmail", email); // Save email for verification

        setTimeout(() => {
          navigate("/verify");
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg rounded" style={{ width: "400px" }}>
        <h2 className="text-center mb-3">Sign Up</h2>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSignup}>
          <Form.Group controlId="name" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="role" className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Employee">Employee</option>
              <option value="Housekeeping">Housekeeping</option>
            </Form.Select>
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">Sign Up</Button>
        </Form>

        <div className="text-center mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </Card>
    </Container>
  );
};

export default Signup;
