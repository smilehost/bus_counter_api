import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

export function QueryRangeToUTC(startDate, endDate) {
  const startDateUTC = dayjs
    .tz(startDate, "Asia/Bangkok")
    .startOf("day")
    .toDate();
  const endDateUTC = dayjs.tz(endDate, "Asia/Bangkok").endOf("day").toDate();
  return { startDateUTC, endDateUTC };
}
export function DateToUTC(date) {
  const QueryStart = dayjs.tz(date, "Asia/Bangkok").startOf("day").toDate();
  const QueryEnd = dayjs.tz(date, "Asia/Bangkok").endOf("day").toDate();
  return { QueryStart, QueryEnd };
}
