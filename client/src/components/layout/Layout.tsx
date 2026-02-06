import Navbar from "../Navbar";

interface LayoutProps {
  children: React.ReactNode;
}
function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col w-screen min-h-screen">
      <nav className="w-screen h-fit py-6 px-10 bg-stone-100">
        <Navbar />
      </nav>

      <main className="flex-1  w-full h-full p-6">{children}</main>
    </div>
  );
}

export default Layout;
