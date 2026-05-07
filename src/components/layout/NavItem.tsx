import Link from "next/link";
import { motion } from "framer-motion";

interface NavItemProps {
  href: string;
  label: string;
  active: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export function NavItem({ href, label, active, onClick }: NavItemProps) {
  const commonClassName = [
    "relative flex t:w-[100px] d:w-32 h-full items-center justify-center gap-2.5 p-2.5 cursor-pointer",
  ].join(" ");

  const content = (
    <>
      <span
        className={[
          "text-center text-xl font-semibold leading-7 transition-colors duration-200",
          active ? "text-white" : "text-white/60 hover:text-white/90",
        ].join(" ")}
      >
        {label}
      </span>
      {active && (
        <motion.div
          layoutId="active-underline"
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </>
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
