interface ErrorResponse {
  status: number;
  message: string;
  code?: number;
  error?: string;
}

function validationError(message: string): ErrorResponse {
  return { status: 400, message };
}

async function apiError(
  response: Response,
  raw?: string,
): Promise<ErrorResponse> {
  if (raw === undefined) {
    try {
      raw = await response.text();
    } catch {
      raw = "";
    }
  }

  let data: Record<string, unknown> | null = null;
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        data = parsed as Record<string, unknown>;
      }
    } catch {
      data = null;
    }
  }

  const message =
    pickString(data, ["message", "error_description", "detail"]) ||
    (typeof data?.error === "string" ? data.error : "") ||
    response.statusText ||
    `Request failed with status ${response.status}`;

  const result: ErrorResponse = { status: response.status, message };

  if (data && typeof data.code === "number") {
    result.code = data.code;
  }

  const details = data?.errors ?? data?.error;
  if (details !== undefined && details !== null && typeof details !== "string") {
    try {
      result.error = JSON.stringify(details);
    } catch {
      result.error = String(details);
    }
  } else if (!data && raw) {
    result.error = raw;
  }

  return result;
}

function unknownError(error: unknown): ErrorResponse {
  if (error instanceof Error && error.message) {
    return { status: 500, message: error.message };
  }
  return { status: 500, message: "An unexpected error occurred" };
}

type RequestResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ErrorResponse };

function pickString(
  data: Record<string, unknown> | null,
  keys: string[],
): string {
  if (!data) return "";
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" && value) return value;
  }
  return "";
}

export {
  ErrorResponse,
  RequestResult,
  validationError,
  apiError,
  unknownError,
};
