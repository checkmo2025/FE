import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/groups/*/admin",
          "/groups/create",
          "/stories/new",
          "/stories/*/edit",
          "/setting",
          "/profile/mypage",
          "/signup",
          "/find-account",
          "/find-password",
          "/ui-test",
        ],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_FRONTEND_URL || "https://www.checkmo.co.kr"}/sitemap.xml`,
  };
}
