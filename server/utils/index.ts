class ResponseObj {
  public msg = "";
  public success = false;

  constructor(success: boolean, msg: string) {
    this.msg = msg;
    this.success = success;
  }
}

export default ResponseObj;
