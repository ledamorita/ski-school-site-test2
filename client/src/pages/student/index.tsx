import { Outlet, Link } from "react-router-dom";
const Student: React.FC = () => {
  return (
    <>
      <h3>Hello student</h3>
      <Link to="/student/registerPage">Register</Link>
      <span> </span>
      <Link to="/student/loginPage">Login</Link>
      <Outlet />
    </>
  );
};

export default Student;
