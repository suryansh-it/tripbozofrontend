// app/bundle-redirect/layout.jsx
export const metadata = {
  title: "Your Travel App Bundle • TripBozo",
};

export default function BundleRedirectLayout({ children }) {
  return (
    <html lang="en">
      
      <body className="bg-white antialiased">
        {children}
      </body>
    </html>
  );
}
