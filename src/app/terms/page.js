// src/app/terms/page.jsx
export const metadata = {
  title: "Terms of Service | tripbozo",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Terms of Service
        </h1>
        <p className="text-gray-600 italic">Last updated: April 18, 2026</p>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-teal-600">Introduction</h2>
          <p className="text-gray-700">
            Welcome to <strong>tripbozo</strong> (“we,” “us,” or “our”). These
            Terms of Service (“Terms”) govern your use of the website{" "}
            <strong>https://tripbozo.com</strong> (the “Site”) and any related
            services or applications we provide. Please read these Terms
            carefully before using our Site. By accessing or using tripbozo, you
            agree to be bound by these Terms.
          </p>
        </section>

        <section className="space-y-4 border-t pt-4">
          <h2 className="text-xl font-bold text-teal-600">1. Definitions</h2>
          <p className="text-gray-700">
            <strong>User</strong>: Any visitor or registered individual using
            the Site. <strong>Content</strong>: Text, images, or data provided
            by tripbozo or Users. <strong>Services</strong>: All features,
            software, and APIs offered through tripbozo.
          </p>
        </section>

        <section className="space-y-4 border-t pt-4">
          <h2 className="text-xl font-bold text-teal-600">2. Use of the Site</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Your access is for personal, non-commercial purposes only.</li>
            <li>
              You will not violate any local, national, or international laws.
            </li>
            <li>
              Reverse engineering, scraping of data, or distribution of
              malware is strictly prohibited.
            </li>
            <li>
              Live travel updates, advisories, country information, and similar content may change without notice and should be treated as informational, not guaranteed facts.
            </li>
            <li>We reserve the right to suspend accounts that breach these Terms.</li>
          </ul>
        </section>

        <section className="space-y-4 border-t pt-4">
          <h2 className="text-xl font-bold text-teal-600">3. User‑Generated Content</h2>
          <p className="text-gray-700">
            You may submit feedback, reviews, or comments (“UGC”). By submitting
            UGC, you grant tripbozo a perpetual, worldwide, royalty-free,
            sublicensable license to use, reproduce, modify, and display your
            content. You represent that you own or have rights to any UGC you
            provide.
          </p>
        </section>

        <section className="space-y-4 border-t pt-4">
          <h2 className="text-xl font-bold text-teal-600">4. Account & Data Use</h2>
          <p className="text-gray-700">
            When you sign in with email, username, or Google, we may store basic account identifiers and your selected origin country to personalize Essentials, recommendations, and travel guidance. You are responsible for keeping your account secure and for any activity under your account.
          </p>
        </section>

        <section className="space-y-4 border-t pt-4">
          <h2 className="text-xl font-bold text-teal-600">5. Ads & Third‑Party Links</h2>
          <p className="text-gray-700">
            Our Site integrates Google AdSense to display advertisements. You
            may see ads based on your browsing. We also link to third‑party
            sites and use external travel data sources; we have no control over
            their content, availability, or privacy practices.
          </p>
        </section>

        <section className="space-y-4 border-t pt-4">
          <h2 className="text-xl font-bold text-teal-600">6. Disclaimer of Warranties</h2>
          <p className="text-gray-700">
            The Site and Services are provided “as is” and “as available.” To
            the fullest extent permitted by law, we disclaim all warranties,
            express or implied, including merchantability, fitness for
            purpose, and non-infringement.
          </p>
        </section>

        <section className="space-y-4 border-t pt-4">
          <h2 className="text-xl font-bold text-teal-600">7. Limitation of Liability</h2>
          <p className="text-gray-700">
            tripbozo and its affiliates will not be liable for any indirect,
            incidental, special, or consequential damages arising out of your
            use of the Site, even if advised of the possibility of such
            damages. Our total liability is limited to $100 USD.
          </p>
        </section>

        <section className="space-y-4 border-t pt-4">
          <h2 className="text-xl font-bold text-teal-600">8. Changes to Terms</h2>
          <p className="text-gray-700">
            We may modify these Terms at any time. Changes will be posted here
            with an updated “Last updated” date. Continued use after changes
            constitutes acceptance.
          </p>
        </section>

        <section className="space-y-4 border-t pt-4">
          <h2 className="text-xl font-bold text-teal-600">9. Governing Law & Disputes</h2>
          <p className="text-gray-700">
            These Terms are governed by Indian law. Any dispute will be subject
            to the exclusive jurisdiction of the courts in your state or city.
          </p>
        </section>

        <section className="space-y-4 border-t pt-4">
          <h2 className="text-xl font-bold text-teal-600">10. Contact Us</h2>
          <p className="text-gray-700">
            If you have questions about these Terms, please reach out at{" "}
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
