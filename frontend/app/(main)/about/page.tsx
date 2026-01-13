import { Metadata } from "next";
import AboutView from "./AboutView";

export const metadata: Metadata = {
  title: "About Us",
  description: "Meet Parnika Bajaj, the founder of Mindsettler. Discover our vision to redefine mental wellness.",
};

export default function AboutPage() {
  return <AboutView />;
}