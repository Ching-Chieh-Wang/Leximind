
import '@/styles/globals.css';
import Background from '@/components/Background';
import Providers from '@/components/Providers';
import Nav from '@/components/Nav/Nav';

const RootLayout = async ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Background />
        <div className="relative p-2.5 sm:p-4">
          <Providers>
            <Nav/>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}

export default RootLayout;