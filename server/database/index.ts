import ResponseObj from "../utils";

const sqlite3 = require("sqlite3").verbose();
class DB {
  private db: any = null;
  constructor() {}
  public init() {
    return new Promise((reslove, reject) => {
      this.db = new sqlite3.Database("./database.db", (err: any) => {
        if (err) reject(err);
        reslove(true);
      });
    });
  }

  public query(sql: string): Promise<any> {
    return new Promise((reslove, reject) => {
      this.db.all(sql, (err: any, row: any) => {
        if (err) {
          reject(err);
        } else {
          reslove(row);
        }
      });
    });
  }

  public queryCurrentUser(username: string, role: number): Promise<any> {
    return this.query(
      `select password from userTable where username = '${username}' and role = ${role}`
    );
  }

  public querySchedule(): Promise<any> {
    return this.query(`select * from scheduleTable2`);
  }

  public queryUserSchedule(
    role: number,
    timeslot: string,
    dateStr: string
  ): Promise<ResponseObj> {
    const isTeacher = role === 1;
    return new Promise((resolve, reject) => {
      let step1Sql = `select COUNT(dateStr) from scheduleTable2 where role = 1 and dateStr = '${dateStr}'`;
      let step2Sql = `select COUNT(dateStr) from scheduleTable2 where role = 0 and dateStr = '${dateStr}'`;
      if (timeslot !== "all") {
        step1Sql += ` and timeslot = '${timeslot}'`;
        step2Sql += ` and timeslot = '${timeslot}'`;
      }
      this.query(step1Sql)
        .then((res) => {
          const hasTeacherSchedule = res[0]["COUNT(dateStr)"] > 0;
          if (isTeacher) {
            if (hasTeacherSchedule) {
              reject(new ResponseObj(false, "Booked by other teachers"));
            } else {
              resolve(new ResponseObj(true, "Add schedule success"));
            }
          } else {
            if (timeslot === "all") {
              if (res[0]["COUNT(dateStr)"] !== 2) {
                reject(
                  new ResponseObj(false, "No teacher booked for the all day")
                );
              }
            }
            if (hasTeacherSchedule) {
              this.query(step2Sql)
                .then((res) => {
                  const hasStudentSchedule = res[0]["COUNT(dateStr)"] > 0;
                  if (!hasStudentSchedule) {
                    resolve(new ResponseObj(true, "Add schedule success"));
                  } else {
                    reject(new ResponseObj(false, "Booked by other students"));
                  }
                })
                .catch((err) => {
                  reject(new ResponseObj(false, "server err"));
                });
            } else {
              reject(
                new ResponseObj(false, "No teachers available for lesson")
              );
            }
          }
        })
        .catch(() => {
          reject(false);
        });
    });
  }

  public addUser(
    username: string,
    email: string,
    password: string,
    role: number
  ) {
    const stmt = this.db.prepare(
      "INSERT OR REPLACE INTO userTable (username, email, password, role) VALUES (?,?,?,?)"
    );
    return stmt.run(username, email, password, role);
  }

  public addSchedule({
    realname,
    timeslot,
    username,
    role,
    dateStr,
  }: {
    realname: string;
    timeslot: string;
    username: string;
    role: number;
    dateStr: string;
  }) {
    const stmt = this.db.prepare(
      `INSERT OR REPLACE INTO scheduleTable2 (realname,timeslot,username,
        role,dateStr
    ) VALUES (?,?,?,?,?)`
    );
    return stmt.run(realname, timeslot, username, role, dateStr);
  }
}
const db = new DB();
db.init();
export default db;
