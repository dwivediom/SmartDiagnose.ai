"use-client";
// src/app/page.js (or wherever your Home component is defined)
import Image from "next/image";
import dynamic from "next/dynamic";
const FirstSection = dynamic(() => import("../components/FirstSection"), {
  ssr: false,
});
const Selection = dynamic(() => import("../components/Selection"), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      {/* {typeof window !== "undefined" && typeof document !== "undefined" && ( */}
      <FirstSection />
      <Selection />
      {/* )} */}
    </main>
  );
}
