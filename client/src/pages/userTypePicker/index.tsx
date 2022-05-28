import { useNavigate } from "react-router-dom";

const UserTypePicker: React.FC = () => {
  const jumpTo = useNavigate();
  const selectType = (url: string, role = "0") => {
    localStorage.setItem("role", role);
    jumpTo(url);
  };

  return (
    <>
      <h2>Choose an account</h2>
      <nav>
        <button onClick={() => selectType("/teacher/loginPage", "1")}>
          I'm a teacher
        </button>
        <br />
        <button onClick={() => selectType("/student/loginPage", "0")}>
          I'm a student
        </button>
      </nav>
    </>
  );
};

export default UserTypePicker;
