import db from "../../prisma/client.js";

export default class AuthRepo {
  constructor() {}

  //   ตัวอย่างฟังก์ชันในการดึงข้อมูลผู้ใช้จากฐานข้อมูล
  findUser(id) {
    return { id, username: "User" + id };
  }
}
