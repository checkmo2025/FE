import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "회원가입",
};

export default function SignupPage() {
  redirect("/signup/terms");
}
