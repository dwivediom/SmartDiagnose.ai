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
    </div>
  );
};

export default Navbar;
