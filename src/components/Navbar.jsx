"use client";
import React from "react";
import "./style.css";
import Link from "next/link";

const Navbar = () => {
  // const router = useRouter();

  return (
    <div className="navbar">
      <Link className="navmenu" href={"/"}>
        Home
      </Link>
      <Link className="navmenu" href={"/"}>
        About Team
      </Link>
      <div
        onClick={() => {
          let val =
            typeof window !== "undefined" &&
            window.localStorage &&
            window.localStorage.getItem("proceedtype");
          if (val == "voice") {
            typeof window !== "undefined" &&
              window.localStorage &&
              window.localStorage.setItem("proceedType", "text");
          }
          if (val == "text") {
            typeof window !== "undefined" &&
              window.localStorage &&
              window.localStorage.setItem("proceedType", "voice");
          }
        }}
        className="navmenu"
      >
        Switch to
        {typeof window !== "undefined" &&
        window.localStorage &&
        window.localStorage.getItem("proceedtype") == "voice"
          ? "Text"
          : "voice"}
      </div>
    </div>
  );
};

export default Navbar;
