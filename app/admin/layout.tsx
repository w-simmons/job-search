import { Sidebar, Header, PageContainer } from "@/components/layout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <PageContainer className="bg-gray-100">{children}</PageContainer>
      </div>
    </div>
  );
}
