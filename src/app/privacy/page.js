// src/app/privacy/page.jsx
export const metadata = {
  title: "Privacy Policy | tripbozo",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Privacy Policy
        </h1>
        <p className="text-gray-600 italic">Last updated: April 17, 2026</p>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-teal-600">Introduction</h2>
          <p className="text-gray-700">
            tripbozo (“we,” “us,” “our”) operates{" "}
            <strong>https://tripbozo.com</strong> (the “Site”). This Privacy
            Policy explains what information we collect, how we use it, and your
            rights. By accessing the Site, you consent to this Policy.
          </p>
        </section>

        <section className="space-y-4 border-t pt-4">
          <h2 className="text-xl font-bold text-teal-600">1. Information We Collect</h2>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            a. Personal Information
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Email address when you sign up or contact us.</li>
            <li>Account details from Google or other supported sign-in methods.</li>
            <li>Any information you voluntarily provide via forms.</li>
            <li>Your selected origin country and travel preferences when you save them.</li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            b. Automatically Collected Data
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>
              <strong>Cookies & Local Storage:</strong> Remember preferences and
              session data.
            </li>
            <li>
              <strong>Usage Data:</strong> Pages visited, country searches, app bundle selections, and feature interactions such as live travel updates.
            </li>
            <li>
              <strong>Analytics:</strong> Google Analytics tracks usage,
              pageviews, referrals.
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mt-4">
            c. Advertising & Third‑Party
          </h3>
          <p className="text-gray-700">
            We partner with Google AdSense for ads; Google may use cookies such
            as DoubleClick for personalized advertising. We also embed links to
            third‑party sites; their data practices are governed by their own
            policies.
          </p>
        </section>

        <section className="space-y-4 border-t pt-4">
          <h2 className="text-xl font-bold text-teal-600">2. How We Use Your Data</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>To remember your session and selected apps.</li>
            <li>To personalize essentials, origin-aware guidance, and country recommendations.</li>
            <li>To display live travel updates, advisories, and country-specific information.</li>
            <li>To improve site performance and diagnose issues.</li>
            <li>To serve relevant ads via AdSense and measure campaign performance.</li>
          </ul>
          <p className="text-gray-700 mt-2">
            We do <strong>not</strong> sell or rent your personal data to third
            parties.
          </p>
        </section>

        <section className="space-y-4 border-t pt-4">
          <h2 className="text-xl font-bold text-teal-600">3. Cookies & Tracking</h2>
          <p className="text-gray-700">
            We use three categories of cookies:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>
              <strong>Essential Cookies:</strong> Enable core functionality
              (login, preferences).
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Google Analytics to analyze
              traffic patterns.
            </li>
            <li>
              <strong>Advertising Cookies:</strong> Google AdSense and partners
              for personalized ads. Manage via banner or browser settings.
            </li>
          </ul>
        </section>

        <section className="space-y-4 border-t pt-4">
          <h2 className="text-xl font-bold text-teal-600">4. Data Retention</h2>
          <p className="text-gray-700">
            Session data is stored up to 24 hours in Redis. Analytics data is
            retained per our provider’s policy. Saved origin-country settings
            and account preferences are retained until you delete your account
            or request removal, unless longer retention is required for legal
            or security reasons. We periodically purge old data to comply with
            privacy best practices.
          </p>
        </section>

        <section className="space-y-4 border-t pt-4">
          <h2 className="text-xl font-bold text-teal-600">5. Your Rights</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Access: Request a copy of your personal data.</li>
            <li>Correction: Ask us to update incorrect information.</li>
            <li>Deletion: Request removal of your data, subject to legal
              obligations.</li>
            <li>Opt‑out: Withdraw consent for cookies via banner or browser
              settings.</li>
          </ul>
        </section>

        <section className="space-y-4 border-t pt-4">
          <h2 className="text-xl font-bold text-teal-600">6. Security</h2>
          <p className="text-gray-700">
            We use HTTPS/TLS to encrypt traffic. Redis sessions are secured and
            access‑controlled. However, no system is 100% secure; use strong
            passwords and keep your software updated.
          </p>
        </section>

        <section className="space-y-4 border-t pt-4">
          <h2 className="text-xl font-bold text-teal-600">7. Children’s Privacy</h2>
          <p className="text-gray-700">
            Our Site is not directed to children under 16. We do not knowingly
            collect personal data from minors. If you believe we have, please
            contact us to have it removed.
          </p>
        </section>

        <section className="space-y-4 border-t pt-4">
          <h2 className="text-xl font-bold text-teal-600">8. Changes & Contact</h2>
          <p className="text-gray-700">
            We may update this Policy; changes take effect when posted with a
            new date. For questions or data requests, contact us at{" "}
            <a
              href="mailto:bozotrip.app@gmail.com"
              className="text-teal-600 hover:underline"
            >
              bozotrip.app@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
