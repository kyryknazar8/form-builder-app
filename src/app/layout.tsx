import ThemeRegistry from '../components/ThemeRegistry/ThemeRegistry';
import Header from '../components/Header';

export const metadata = {
  title: 'Form Builder',
  description: 'Dynamic Form Builder system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body suppressHydrationWarning>
        <ThemeRegistry>
          <Header />
          <main style={{ padding: '2rem' }}>{children}</main>
        </ThemeRegistry>
      </body>
    </html>
  );
}
