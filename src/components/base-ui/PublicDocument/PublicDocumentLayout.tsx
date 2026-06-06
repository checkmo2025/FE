import Link from "next/link";
import type { ReactNode } from "react";

type PublicDocumentLayoutProps = {
  title: string;
  description?: string;
  effectiveDate?: string;
  children: ReactNode;
};

export function PublicDocumentLayout({
  title,
  description,
  effectiveDate,
  children,
}: PublicDocumentLayoutProps) {
  return (
    <main className="min-h-screen bg-background px-5 py-10 t:px-8 t:py-16">
      <div className="mx-auto flex w-full max-w-[860px] flex-col gap-8">
        <header className="flex flex-col gap-6 border-b border-Subbrown-3 pb-8">
          <Link
            href="/"
            className="w-fit text-[18px] font-bold leading-[135%] text-primary-3"
            aria-label="책모 홈으로 이동"
          >
            책모
          </Link>
          <div className="flex flex-col gap-3">
            <h1 className="text-[30px] font-bold leading-[135%] text-Gray-7 t:text-[40px]">
              {title}
            </h1>
            {description ? (
              <p className="max-w-[720px] text-[16px] font-normal leading-[170%] text-Gray-5">
                {description}
              </p>
            ) : null}
            {effectiveDate ? (
              <p className="text-[14px] font-medium leading-[145%] text-primary-2">
                시행일: {effectiveDate}
              </p>
            ) : null}
          </div>
        </header>
        <div className="flex flex-col gap-8 text-Gray-6">{children}</div>
      </div>
    </main>
  );
}

export function DocumentSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-[20px] font-semibold leading-[145%] text-Gray-7 t:text-[22px]">
        {title}
      </h2>
      <div className="text-[15px] font-normal leading-[175%] text-Gray-5 t:text-[16px]">
        {children}
      </div>
    </section>
  );
}

export function DocumentList({ items }: { items: string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

