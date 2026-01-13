import { Metadata } from "next";
import FAQClient from "./FAQClient";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers about booking sessions, pricing, online therapy effectiveness, and patient confidentiality.",
};

export default function FAQPage() {
  return <FAQClient />;
}