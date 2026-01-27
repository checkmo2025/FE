import Link from "next/link";

interface NavItemProps {
  href: string;
  label: string;
  active: boolean;
}

export function NavItem({ href, label, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={[
        "flex t:w-[100px] d:w-32 items-center justify-center gap-2.5 p-2.5",
        active ? "border-b-2 border-white" : "border-b-2 border-transparent",
      ].join(" ")}
    >
      <span
        className={[
          "text-center text-xl font-semibold leading-7",
          active ? "text-white" : "text-gray-200",
        ].join(" ")}
      >
        {label}
      </span>
    </Link>
  );
}
