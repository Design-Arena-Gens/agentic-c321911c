export const metadata = {
  title: 'Personal AI Agent - Free',
  description: 'Your free personal AI assistant',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
