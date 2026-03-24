const ENROLLMENT_PREFIX = "SC23CS301";
const MIN_NUMBER = 118;
const MAX_NUMBER = 168;

// Missing / non-existent students
const BLOCKED_NUMBERS = new Set([
  135,
  136,
  138,
  145,
  153
]);

const isValidEnrollment = (enrollment) => {
  if (!enrollment || typeof enrollment !== "string") {
    return false;
  }

  if (!enrollment.startsWith(ENROLLMENT_PREFIX)) {
    return false;
  }

  const numberPart = enrollment.slice(ENROLLMENT_PREFIX.length);
  const number = Number(numberPart);

  if (!Number.isInteger(number)) {
    return false;
  }

  // range check
  if (number < MIN_NUMBER || number > MAX_NUMBER) {
    return false;
  }

  // missing roll numbers check
  if (BLOCKED_NUMBERS.has(number)) {
    return false;
  }

  return true;
};

module.exports = {
  isValidEnrollment
};
