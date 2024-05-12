type FileLayoutProps = {
  children: React.ReactNode;
};

export default function FileLayout({ children }: FileLayoutProps) {
  return (
    <div>
      File Layout
      {children}
    </div>
  );
}
