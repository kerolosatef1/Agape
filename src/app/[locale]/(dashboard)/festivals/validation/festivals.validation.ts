import { useTranslations } from "next-intl";
import { z } from "zod";

export const getFestivalSchema = (
  t: ReturnType<typeof useTranslations<"pages.festivals">>,
) => {
  return z.object({
    churchFestivalName: z
      .string()
      .trim()
      .min(1, t("validation.nameRequired"))
      .min(2, t("validation.nameMin")),
  });
};

export type TFestivalInput = z.input<ReturnType<typeof getFestivalSchema>>;