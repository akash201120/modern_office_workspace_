import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Token Received:", data.token);
      
      if (response.ok && data.token) {
        localStorage.setItem("token", data.token); // Store token in localStorage
        toast.success("Login Successfully!", { autoClose: 2000 });

        setTimeout(() => {
          navigate("/dashboard"); // Redirect to dashboard after success
        }, 2000);
      } else {
        setError(data.message || "Invalid email or password. Try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };
      
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4" style={{ width: "400px" }}>
        <h2 className="text-center">Login</h2>
        <ToastContainer />
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleLogin}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          

          <Form.Group controlId="password" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          

          <Button type="submit" variant="primary" className="w-100 mt-3">Login</Button>
        </Form>
        <div className="text-center mt-2">
  <Link to="/forgot-password">Forgot Password?</Link>
</div>

        <div className="text-center mt-3">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </Card>
    </Container>
  );
};

export default Login;
