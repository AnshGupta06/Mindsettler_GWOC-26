import { Metadata } from "next";
import AwarenessClient from "./AwarenessClient";

export const metadata: Metadata = {
  title: "Mental Health Awareness Hub",
  description: "Understand your mind. Explore our psycho-education resources on anxiety, depression, trauma, and emotional well-being.",
};

export default function AwarenessPage() {
  return <AwarenessClient />;
}