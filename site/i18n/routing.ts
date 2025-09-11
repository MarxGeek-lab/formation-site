import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["fr", "en"], // Define in this line the possible languages for translation
  defaultLocale: "fr", // Define in this line the default language to be shown
  localeDetection: true
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);