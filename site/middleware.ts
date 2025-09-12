// import createMiddleware from "next-intl/middleware";
// import { routing } from "./i18n/routing";

// export default createMiddleware(routing);

// export const config = {
//   matcher: ["/", "/(fr|en)/:path*"], // At this line, define into the matcher all the availables language you have defined into routing.ts
// };
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  // 1️⃣ Gestion de la langue (Next-Intl)
  const intlMiddleware = createMiddleware(routing);
  let res = await intlMiddleware(req);

  // 2️⃣ Capture du paramètre 'ref'
  const ref = req.nextUrl.searchParams.get("ref");
  console.log("ref capté == ", ref)
  if (ref) {
    // Créer ou mettre à jour le cookie 'affiliate_ref'
    res.cookies.set("affiliate_ref", ref, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 jours
      httpOnly: false,
      // secure: process.env.NODE_ENV === "production",
      secure: false,
    });
  }

  return res;
}

export const config = {
  matcher: ["/", "/(fr|en)/:path*"], 
};
