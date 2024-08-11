"use client";
// src/app/page.js (or wherever your Home component is defined)
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { get_prompt_response } from "../../utils/modle";
import { samplePrompt, sample_dite_prompt } from "../../utils/smapleprompt";
import { useEffect } from "react";
import Modal from "@/components/Modal";

const FirstSection = dynamic(() => import("../components/FirstSection"), {
  ssr: false,
});
const Selection = dynamic(() => import("../components/Selection"), {
  ssr: false,
});

export default function Home() {
  // const scrollToBottom = (id) => {
  //   window.scrollTo(0, document.body.scrollHeight);
  // };
  return (
    <main id="mainpage">
      <div
      // onMouseOver={() => {
      //   setTimeout(() => {
      //     scrollToBottom();
      //   }, 8000);
      // }}
      >
        <FirstSection />
      </div>
      <Selection />

      {/* )} */}
    </main>
  );
}
