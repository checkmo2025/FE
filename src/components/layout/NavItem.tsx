import Link from "next/link";

interface NavItemProps {
  href: string;
  label: string;
  active: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export function NavItem({ href, label, active, onClick }: NavItemProps) {
  const commonClassName = [
    "flex t:w-[100px] d:w-32 items-center justify-center gap-2.5 p-2.5 cursor-pointer",
    active ? "border-b-2 border-white" : "border-b-2 border-transparent",
  ].join(" ");

  const content = (
    <span
      className={[
        "text-center text-xl font-semibold leading-7",
        active ? "text-white" : "text-gray-100",
      ].join(" ")}
    >
      {label}
    </span>
  );

  if (onClick) {
    return (
      <div onClick={onClick} className={commonClassName}>
        {content}
      </div>
    );
  }

  return (
    <Link href={href} className={commonClassName}>
      {content}
    </Link>
  );
}
