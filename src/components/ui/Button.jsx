import React from "react";
export default function Button({ kind="default", className="", ...props }) {
  const cls = ["btn", kind === "primary" ? "primary" : "", className].join(" ").trim();
  return <button {...props} className={cls} />;
}
