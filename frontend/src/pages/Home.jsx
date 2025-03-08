import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Welcome to Housekeeping Management</h1>
      <Link to="/admin">
        <button>Go to Admin Dashboard</button>
      </Link>
    </div>
  );
};

export default Home;
