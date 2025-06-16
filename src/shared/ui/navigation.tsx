"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/shared/ui/button";

const NAV_ROUTES = [
  {
    title: "Dashboard",
    href: "/",
  },
  {
    title: "Planner",
    href: "/planner",
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav>
      {NAV_ROUTES.map(({ title, href }) => (
        <Button
          key={href}
          variant={"link"}
          isActive={pathname === href}
          asChild
        >
          <Link href={href}>{title}</Link>
        </Button>
      ))}
    </nav>
  );
}
