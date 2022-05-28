import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <>
      <main>
        <h1>Welcom</h1>
      </main>
      <nav>
        <Link to="/userTypePicker">Login</Link>
      </nav>
    </>
  );
};

export default Home;
