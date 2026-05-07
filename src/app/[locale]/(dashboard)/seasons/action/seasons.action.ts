"use server";

import {
  addSeason,
  editSeason,
  deleteSeason,
  activateSeason,
} from "../service/seasons.services";
import { getErrorMessage } from "@/src/shared/lib/axios/axios.instance";

export type SeasonActionState = {
  success: boolean;
  message: string;
};

const initialState: SeasonActionState = {
  success: false,
  message: "",
};

async function safeAction(fn: () => Promise<any>): Promise<SeasonActionState> {
  try {
    const response = await fn();
    return {
      success: true,
      message:
        typeof response === "string"
          ? response
          : response?.message || "Done successfully!",
    };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

// Server Action for Add Season (useActionState compatible)
export async function addSeasonFormAction(
  _prevState: SeasonActionState,
  formData: FormData,
): Promise<SeasonActionState> {
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  return safeAction(() => addSeason({ name, password }));
}

// Server Action for Edit Season
export async function editSeasonFormAction(
  _prevState: SeasonActionState,
  formData: FormData,
): Promise<SeasonActionState> {
  const id = Number(formData.get("seasonId"));
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  return safeAction(() => editSeason(id, { name, password }));
}

// Server Action for Activate Season
export async function activateSeasonFormAction(
  _prevState: SeasonActionState,
  formData: FormData,
): Promise<SeasonActionState> {
  const id = Number(formData.get("seasonId"));
  const password = formData.get("password") as string;
  return safeAction(() => activateSeason({ id, password }));
}

// Regular action (not form-based)
export const deleteSeasonAction = async (id: number) =>
  safeAction(() => deleteSeason(id));