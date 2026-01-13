import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with MindSettler. Book a session, ask a question, or reach out for support.",
};

export default function ContactPage() {
  return <ContactClient />;
}