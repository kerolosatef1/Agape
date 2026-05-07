import "server-only";
import { getMessages as getNextIntlMessages } from "next-intl/server";

export async function getMessages() {
  return await getNextIntlMessages();
}
