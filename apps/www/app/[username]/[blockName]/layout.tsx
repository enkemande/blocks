type BlockLayoutProps = {
  children: React.ReactNode;
};

export default function BlockLayout({ children }: BlockLayoutProps) {
  return (
    <div>
      Block Layout
      {children}
    </div>
  );
}
