import express from "express";
import db from "./database";
import ResponseObj from "./utils";
import path from "path";

const app: express.Express = express();

const PORT = process.env.PORT || 9000;

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./build")));

app.post("/create", (req: express.Request, res: express.Response) => {
  const { username, email, password, role } = req.body.data;
  db.queryCurrentUser(username, role)
    .then((row: any) => {
      if (row.length === 0) {
        db.addUser(username, email, password, role);
        return res.send(
          JSON.stringify({
            code: 0,
            msg: "register success",
          })
        );
      } else {
        return res.send(
          JSON.stringify({
            code: 1,
            msg: "username already exist",
          })
        );
      }
    })
    .catch((err) => {
      return res.send(
        JSON.stringify({
          code: -1,
          msg: err,
        })
      );
    });
});

app.post("/login", (req: express.Request, res: express.Response) => {
  const { username, password, role } = req.body.data;
  db.queryCurrentUser(username, role)
    .then((row: any) => {
      if (row.length === 0) {
        return res.send(
          JSON.stringify({
            code: -1,
            msg: "username or password error",
          })
        );
      } else {
        const realPassword = row[0].password;
        if (realPassword === password) {
          return res.send(
            JSON.stringify({
              code: 0,
              msg: "login success",
            })
          );
        } else {
          return res.send(
            JSON.stringify({
              code: -1,
              msg: "username or password error",
            })
          );
        }
      }
    })
    .catch((err) => {
      return res.send(
        JSON.stringify({
          code: -1,
          msg: err,
        })
      );
    });
});

app.post("/addSchedule", (req: express.Request, res: express.Response) => {
  try {
    const { realname, timeslot, username, role, dateStr } = req.body.data;
    db.queryUserSchedule(role, timeslot, dateStr)
      .then((sqlRes: ResponseObj) => {
        if (!sqlRes.success) {
          return res.send(
            JSON.stringify({
              code: -1,
              msg: sqlRes.msg,
            })
          );
        } else {
          if (timeslot === "all") {
            db.addSchedule({
              realname,
              timeslot: "am",
              username,
              role,
              dateStr,
            });
            db.addSchedule({
              realname,
              timeslot: "pm",
              username,
              role,
              dateStr,
            });
          } else {
            db.addSchedule({
              realname,
              timeslot,
              username,
              role,
              dateStr,
            });
          }
          return res.send(
            JSON.stringify({
              code: 0,
              msg: sqlRes.msg,
            })
          );
        }
      })
      .catch((err: ResponseObj) => {
        return res.send(
          JSON.stringify({
            code: -1,
            msg: err.msg,
          })
        );
      });
  } catch (error: any) {
    return res.send(
      JSON.stringify({
        code: -1,
        msg: error.msg,
      })
    );
  }
});

app.get("/querySchedule", (req: express.Request, res: express.Response) => {
  db.querySchedule().then((data: any) => {
    return res.send(
      JSON.stringify({
        code: 0,
        data,
        msg: "query success",
      })
    );
  });
});

app.get("*", (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, "./build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
