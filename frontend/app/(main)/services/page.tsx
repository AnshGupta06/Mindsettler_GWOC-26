import { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Therapeutic Services",
  description: "Explore our evidence-based therapeutic approaches including CBT, stress management, couples therapy, and corporate wellness.",
};

export default function ServicesPage() {
  return <ServicesClient />;
}