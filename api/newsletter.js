import {
  isNewsletterOriginAllowed,
  subscribeNewsletter,
  validateNewsletterPayload,
} from "../server/newsletter-core.js";

const MAX_BODY_BYTES = 2 * 1024;

function jsonResponse(request, status, body) {
  const headers = new Headers({
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    Vary: "Origin",
  });
  const origin = request.headers.get("origin");
  if (isNewsletterOriginAllowed(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    if (request.method === "OPTIONS") {
      headers.set("Access-Control-Allow-Methods", "POST");
      headers.set(
        "Access-Control-Allow-Headers",
        request.headers.get("access-control-request-headers") ?? "Content-Type",
      );
    }
  }
  if (status === 405) headers.set("Allow", "POST");

  return new Response(JSON.stringify(body), { status, headers });
}

async function readJsonBody(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("invalid_body");

  const chunks = [];
  let totalBytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new Error("body_too_large");
    }
    chunks.push(value);
  }

  const bodyBytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bodyBytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(bodyBytes));
}

async function handleNewsletterRequest(request) {
  if (request.method !== "POST") {
    return jsonResponse(request, 405, {
      status: "error",
      code: "method_not_allowed",
    });
  }

  const contentType = request.headers
    .get("content-type")
    ?.split(";")[0]
    .trim()
    .toLowerCase();
  if (contentType !== "application/json") {
    return jsonResponse(request, 400, {
      status: "error",
      code: "invalid_request",
    });
  }

  const contentLength = request.headers.get("content-length");
  if (
    contentLength !== null &&
    (!/^\d+$/.test(contentLength) || Number(contentLength) > MAX_BODY_BYTES)
  ) {
    return jsonResponse(request, 400, {
      status: "error",
      code: "invalid_request",
    });
  }

  let body;
  try {
    body = await readJsonBody(request);
  } catch {
    return jsonResponse(request, 400, {
      status: "error",
      code: "invalid_request",
    });
  }

  const validation = validateNewsletterPayload(body);
  if (validation.status) {
    return jsonResponse(request, validation.status, {
      status: "error",
      code: validation.code,
    });
  }
  if (validation.honeypot) {
    return jsonResponse(request, 200, { status: "ok" });
  }

  try {
    await subscribeNewsletter(validation.email);
    return jsonResponse(request, 200, { status: "ok" });
  } catch {
    return jsonResponse(request, 503, {
      status: "error",
      code: "newsletter_unavailable",
    });
  }
}

export default {
  fetch: handleNewsletterRequest,
};
