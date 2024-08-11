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
          let val = localStorage.getItem("proceedtype");
          if (val == "voice") {
            localStorage.setItem("proceedType", "text");
          }
          if (val == "text") {
            localStorage.setItem("proceedType", "voice");
          }
        }}
        className="navmenu"
      >
        Switch to
        {localStorage.getItem("proceedtype") == "voice" ? "Text" : "voice"}
      </div>
    </div>
  );
};

export default Navbar;
