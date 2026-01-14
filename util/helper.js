import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

export default class Helper {
  static getCurrentTimestamp() {
    return dayjs().format();
  }

  static getCurrentDate() {
    return dayjs().format("YYYY-MM-DD");
  }

  static getCurrentTime() {
    return dayjs().format("HH:mm:ss");
  }

  static getCurrentDateTime() {
    return dayjs().format("YYYY-MM-DD HH:mm:ss");
  }

  static getCurrentUnixTimestamp() {
    return dayjs().unix();
  }

  static formatDate(date, format = "YYYY-MM-DD") {
    return dayjs(date).format(format);
  }

  static formatDateTime(date, format = "YYYY-MM-DD HH:mm:ss") {
    return dayjs(date).format(format);
  }

  static formatTime(date, format = "HH:mm:ss") {
    return dayjs(date).format(format);
  }

  static convertToUTC(date) {
    return dayjs(date).utc().format();
  }

  static convertToTimeZone(date, timezone = "Asia/Bangkok") {
    return dayjs(date).tz(timezone).format();
  }

  static calculateDateDifference(date1, date2, unit = "day") {
    const d1 = dayjs(date1);
    const d2 = dayjs(date2);
    return d2.diff(d1, unit);
  }

  static addToDate(date, value, unit = "day") {
    return dayjs(date).add(value, unit).format();
  }

  static subtractFromDate(date, value, unit = "day") {
    return dayjs(date).subtract(value, unit).format();
  }
}
