import Link from "next/link";
import React from "react";

const NavigationBar = () => {
  const commonClasses = "font-semibold text-lg px-2 py-2 hover:animate-pulse";
  return (
    <nav className="space-x-4 w-full flex items-center justify-center">
      <Link href={"/"} className={`${commonClasses}`}>
        Home
      </Link>
      <Link href={"/dashboard"} className={`${commonClasses}`}>
        Dashboard
      </Link>
      <Link href={"/charts"} className={`${commonClasses}`}>
        Charts
      </Link>
    </nav>
  );
};

export default NavigationBar;
