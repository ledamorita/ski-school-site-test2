import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config";

const LoginForm: React.FC = () => {
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    username: string
  ): void => {
    if (data.username === "" || data.password === "") {
      alert("Can't be empty!");
    } else {
      axiosInstance
        .post("/login", {
          data: {
            ...data,
            role: Number(localStorage.getItem("role")),
          },
        })
        .then((res) => {
          if (res.status === 200) {
            if (res.data.code === 0) {
              navigate("/booking");
            } else {
              alert(res.data.msg);
            }
          }
        })
        .catch((e) => {
          console.warn(e);
        });
      localStorage.setItem("username", data.username);
    }
  };

  return (
    <>
      <form>
        <p>username</p>
        <input
          type="text"
          id="username"
          name="username"
          value={data.username}
          onChange={handleChange}
          required
        />
        <p>password</p>
        <input
          type="password"
          id="password"
          name="password"
          value={data.password}
          onChange={handleChange}
          required
        />
      </form>
      <div>
        <button onClick={(e) => handleClick(e, "username")}>summit</button>
      </div>
    </>
  );
};

export default LoginForm;
