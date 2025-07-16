export const DateValidateUtil = (v: string | null): string | null => {
  const DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  const DATETIME_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\s([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

  if (v === null) {
    return null;
  }

  // yyyy-MM-dd
  if (DATE_REGEX.test(v)) {
    const [y, mo, d] = v.split('-').map(Number);
    const dt = new Date(y, mo - 1, d);

    if (dt.getFullYear() === y && dt.getMonth() + 1 === mo && dt.getDate() === d) {
      return v;
    }
  }

  // yyyy-MM-dd HH:mm:ss
  if (DATETIME_REGEX.test(v)) {
    const [datePart, timePart] = v.split(' ');
    const [y, mo, d] = datePart.split('-').map(Number);
    const [h, mi, s] = timePart.split(':').map(Number);
    const dt = new Date(y, mo - 1, d, h, mi, s);

    if (dt.getFullYear() === y && dt.getMonth() + 1 === mo && dt.getDate() === d && dt.getHours() === h && dt.getMinutes() === mi && dt.getSeconds() === s) {
      return v;
    }
  }

  return null;
};
