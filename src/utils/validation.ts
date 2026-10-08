type Rule = string | null;

function collect(...rules: Rule[]): string | null {
  const errors = rules.filter((rule): rule is string => rule !== null);
  return errors.length > 0 ? errors.join("; ") : null;
}

function required(value: unknown, label: string): Rule {
  if (value === undefined || value === null || value === "") {
    return `${label} is required`;
  }
  return null;
}

function bdPhone(value: unknown, label: string): Rule {
  const message = required(value, label);
  if (message) return message;
  if (typeof value !== "string" || !/^\d{11}$/.test(value)) {
    return `${label} must be exactly 11 digits`;
  }
  return null;
}

function maxLength(value: unknown, max: number, label: string): Rule {
  if (typeof value !== "string" || value.length === 0) return null;
  if (value.length > max) {
    return `${label} cannot be greater than ${max} characters`;
  }
  return null;
}

function minLength(value: unknown, min: number, label: string): Rule {
  if (typeof value !== "string" || value.length === 0) return null;
  if (value.length < min) {
    return `${label} must be at least ${min} characters`;
  }
  return null;
}

function nonNegativeNumber(value: unknown, label: string): Rule {
  const message = required(value, label);
  if (message) return message;
  const num = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(num)) return `${label} must be a number`;
  if (num < 0) return `${label} cannot be less than 0`;
  return null;
}

function positiveNumber(value: unknown, label: string): Rule {
  const message = required(value, label);
  if (message) return message;
  const num = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(num)) return `${label} must be a number`;
  if (num <= 0) return `${label} must be greater than 0`;
  return null;
}

function positiveInteger(value: unknown, label: string): Rule {
  const message = required(value, label);
  if (message) return message;
  const num = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(num)) return `${label} must be a number`;
  if (!Number.isInteger(num)) return `${label} must be an integer`;
  if (num <= 0) return `${label} must be greater than 0`;
  return null;
}

function oneOf(value: unknown, allowed: number[], label: string): Rule {
  const message = required(value, label);
  if (message) return message;
  const num = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(num) || !allowed.includes(num)) {
    return `${label} must be one of: ${allowed.join(", ")}`;
  }
  return null;
}

export {
  Rule,
  collect,
  required,
  bdPhone,
  maxLength,
  minLength,
  nonNegativeNumber,
  positiveNumber,
  positiveInteger,
  oneOf,
};
