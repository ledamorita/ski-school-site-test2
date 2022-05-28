import { Link, Outlet } from "react-router-dom";
const Teacher: React.FC = () => {
  return (
    <>
      <h3>Hello teacher</h3>
      <Link to={"/teacher/registerPage"}>Register</Link>
      <span> </span>
      <Link to={"/teacher/loginPage"}>Login</Link>
      <Outlet />
    </>
  );
};

export default Teacher;
