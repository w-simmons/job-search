interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <main className={`flex-1 p-6 overflow-auto bg-gray-50 ${className}`}>
      {children}
    </main>
  );
}
