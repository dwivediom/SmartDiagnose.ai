
'use client'
// src/app/page.js (or wherever your Home component is defined)
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { get_prompt_response } from "../../utils/modle";
import { samplePrompt  , sample_dite_prompt} from "../../utils/smapleprompt";
import { useEffect } from "react";

const FirstSection = dynamic(() => import("../components/FirstSection"), {
  ssr: false,
});
const Selection = dynamic(() => import("../components/Selection"), {
  ssr: false,
});


export default function Home() {
  return (
    <main>
       <button style={{color: "white" , zIndex:300}} onClick={()=>get_prompt_response(sample_dite_prompt)} > sample response </button>

      {/* {typeof window !== "undefined" && typeof document !== "undefined" && ( */}
      {/* <FirstSection />
      <Selection /> */}
     
      {/* )} */}
    </main>
  );
}
