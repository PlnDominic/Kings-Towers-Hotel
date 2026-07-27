import { sendMail } from "@/lib/mailer";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { email } = body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  try {
    await sendMail({
      subject: "New newsletter signup from Kings Towers Hotel website",
      text: `New newsletter signup: ${email}`,
      html: `<p>New newsletter signup: <strong>${escapeHtml(email)}</strong></p>`,
    });
  } catch (err) {
    console.error("[newsletter] failed to send mail:", err);
    return Response.json({ error: "Could not process signup right now." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
