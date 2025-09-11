export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-8 mx-auto text-center max-w-[1280px]">{children}</div>
  );
}
