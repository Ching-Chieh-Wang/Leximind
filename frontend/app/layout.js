
import '@/styles/globals.css';
import Background from '@/components/Background';
import Providers from '@/components/Providers';
import Nav from '@/components/Nav/Nav';

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Background />

          <Providers>
          <div className="p-2.5 sm:p-4">
            <Nav />
            {children}
            </div>
          </Providers>

      </body>
    </html>
  );
}

export default RootLayout;