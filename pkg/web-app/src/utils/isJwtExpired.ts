import dayjs from "dayjs";

export const isJwtExpired = (exp: number): boolean => {
  return dayjs().isAfter(exp);
}
