import { useState } from "react";
import { axiosInstance } from "../../config";

const RegisForm: React.FC = () => {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    if (data.username === "" || data.email === "" || data.password === "") {
      alert("Can't be empty!");
    } else {
      axiosInstance
        .post("/create", {
          data: { ...data, role: Number(localStorage.getItem("role")) },
        })
        .then((res) => {
          if (res.status === 200) {
            if (res.data.code === 0) {
              alert("register success");
            } else if (res.data.code === 1) {
              alert("username already exist");
            } else {
              alert(res.data.msg);
            }
            console.log(res.data);
          }
        })
        .catch((e) => {
          console.warn(e);
        });
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
        />

        <p>email</p>
        <input
          type="email"
          id="email"
          name="email"
          value={data.email}
          onChange={handleChange}
        />
        <p>password</p>
        <input
          type="password"
          id="password"
          name="password"
          value={data.password}
          onChange={handleChange}
        />
      </form>
      <div>
        <button onClick={handleClick}>Register</button>
      </div>
    </>
  );
};

export default RegisForm;
