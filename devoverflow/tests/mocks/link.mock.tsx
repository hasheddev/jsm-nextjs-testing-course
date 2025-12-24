import React from "react";

export const MockLink = ({ href, children }: { href: string; children?: React.ReactNode }) => {
  return <a href={href}>{children}</a>;
};
