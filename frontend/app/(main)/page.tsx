import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Mindsettler | Your Journey to Mental Wellness", 
  description: "Begin your personalized journey to healing. We bridge the gap between professional therapy and self-understanding.",
};

export default function HomePage() {
  return <HomeClient />;
}