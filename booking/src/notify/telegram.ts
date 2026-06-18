import type { BookingRequestRow } from "../db.js";
import type { TimeSlot } from "../slots.js";
import { formatDateInZone, formatTimeInZone } from "../timezone.js";

export interface TelegramSendResult {
  ok: boolean;
  error?: string;
}

export async function sendTelegramMessage(
  botToken: string,
  chatId: string,
  text: string,
): Promise<TelegramSendResult> {
  if (!botToken || !chatId) {
    return { ok: false, error: "Telegram not configured" };
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          disable_web_page_preview: true,
        }),
      },
    );

    const payload = (await response.json()) as {
      ok: boolean;
      description?: string;
    };

    if (!response.ok || !payload.ok) {
      return {
        ok: false,
        error: payload.description ?? `HTTP ${response.status}`,
      };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown Telegram error",
    };
  }
}

function purposeLabel(purpose: string): string {
  return purpose === "recruitment" ? "Recruitment" : "Trial lesson";
}

function formatSlotLine(
  slotId: string,
  slots: TimeSlot[],
  clientTimezone?: string | null,
): string {
  const slot = slots.find((item) => item.id === slotId);
  if (!slot) return `• ${slotId}`;

  const studioLine = slot.labelEn;
  if (!clientTimezone || clientTimezone === "Asia/Shanghai") {
    return `• ${studioLine} CST`;
  }

  const clientDate = formatDateInZone(slot.startIso, clientTimezone, "en-GB");
  const clientTime = formatTimeInZone(slot.startIso, clientTimezone, "en-GB");
  const clientEnd = formatTimeInZone(slot.endIso, clientTimezone, "en-GB");
  return `• ${studioLine} CST (client: ${clientDate} ${clientTime}–${clientEnd})`;
}

export function formatBookingNotification(
  row: BookingRequestRow,
  slots: TimeSlot[],
): string {
  const preferred = (JSON.parse(row.preferred_slots) as string[])
    .map((slotId) => formatSlotLine(slotId, slots, row.client_timezone))
    .join("\n");

  const contact = [row.email, row.phone].filter(Boolean).join(" / ");
  const note = row.note ? `\nNotes: ${row.note}` : "";
  const clientTz = row.client_timezone
    ? `\nClient timezone: ${row.client_timezone}`
    : "";

  return [
    `📋 New booking request #${row.id}`,
    `Name: ${row.name}`,
    `Type: ${purposeLabel(row.purpose)}`,
    `Contact: ${contact}`,
    "Preferred times:",
    preferred,
    clientTz,
    `Submitted: ${row.created_at}`,
    note,
    "",
    "⚠️ This is a request only — please confirm the final time with the client.",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function sendTelegramToAll(
  botToken: string,
  chatIds: string[],
  text: string,
): Promise<TelegramSendResult> {
  if (!botToken || chatIds.length === 0) {
    return { ok: false, error: "Telegram not configured" };
  }

  let lastError: string | undefined;
  let sent = 0;

  for (const chatId of chatIds) {
    const result = await sendTelegramMessage(botToken, chatId, text);
    if (result.ok) {
      sent += 1;
    } else {
      lastError = result.error;
    }
  }

  if (sent === 0) {
    return { ok: false, error: lastError ?? "No messages sent" };
  }

  if (lastError && sent < chatIds.length) {
    return { ok: true, error: `partial: ${lastError}` };
  }

  return { ok: true };
}

export async function getTelegramUpdates(
  botToken: string,
): Promise<Array<{ chatId: string; username?: string; firstName?: string }>> {
  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/getUpdates`,
  );
  const payload = (await response.json()) as {
    ok: boolean;
    result?: Array<{
      message?: {
        chat: { id: number; username?: string; first_name?: string };
      };
    }>;
  };

  if (!payload.ok || !payload.result) return [];

  const seen = new Set<string>();
  const chats: Array<{ chatId: string; username?: string; firstName?: string }> =
    [];

  for (const update of payload.result) {
    const chat = update.message?.chat;
    if (!chat) continue;
    const chatId = String(chat.id);
    if (seen.has(chatId)) continue;
    seen.add(chatId);
    chats.push({
      chatId,
      username: chat.username,
      firstName: chat.first_name,
    });
  }

  return chats;
}
