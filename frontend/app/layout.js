
import '@/styles/globals.css';
import Background from '@/components/Background';
import RootProviders from '@/components/RootProviders';
import Nav from '@/components/nav/Nav';
import '../utils/healthCheck'; 

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Background />
          <RootProviders>
          <div className="p-2.5 sm:p-4">
            <Nav />
            {children}
            </div>
          </RootProviders>
      </body>
    </html>
  );
}

export default RootLayout;