import { PageHeader } from '../../components/shared/PageHeader';

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        subtitle="Our commitment to protecting your personal information."
      />

      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="prose prose-lg mx-auto max-w-none text-purple-900 prose-headings:font-headline prose-headings:text-purple-800 prose-a:text-purple-600 hover:prose-a:text-purple-700 prose-strong:text-purple-800 prose-li:text-purple-800">
            <p className="text-purple-800">
              This Privacy Policy describes how MindBloom ("we", "us", or "our")
              collects, uses, and discloses your information when you use our
              website and services.
            </p>

            <h2 className="text-purple-800">1. Information We Collect</h2>
            <p className="text-purple-800">We may collect the following types of information:</p>
            <ul className="text-purple-800">
              <li>
                <strong>Personal Identification Information:</strong> Name,
                email address, phone number, etc., that you provide when
                booking a session or contacting us.
              </li>
              <li>
                <strong>Booking Information:</strong> Details about the sessions
                you book, including date, time, and session type.
              </li>
              <li>
                <strong>Communications:</strong> Any information you provide
                when you communicate with us, including through our contact
                form or chatbot.
              </li>
            </ul>

            <h2 className="text-purple-800">2. How We Use Your Information</h2>
            <p className="text-purple-800">We use the information we collect to:</p>
            <ul className="text-purple-800">
              <li>Provide, operate, and maintain our services.</li>
              <li>Process your bookings and manage your appointments.</li>
              <li>Communicate with you, including sending confirmations and reminders.</li>
              <li>Respond to your comments, questions, and requests.</li>
              <li>Improve our website and services.</li>
            </ul>

            <h2 className="text-purple-800">3. Information Sharing and Disclosure</h2>
            <p className="text-purple-800">
              We do not sell or rent your personal information to third parties.
              Your information is treated as confidential and is subject to the
              terms of our Confidentiality Policy. We may only disclose
              information if required by law.
            </p>

            <h2 className="text-purple-800">4. Data Security</h2>
            <p className="text-purple-800">
              We implement a variety of security measures to maintain the safety
              of your personal information. We use secure platforms for data
              storage and communication to protect against unauthorized access,
              alteration, or disclosure.
            </p>

            <h2 className="text-purple-800">5. Your Rights</h2>
            <p className="text-purple-800">
              You have the right to access, update, or request deletion of your
              personal information. Please contact us to make such a request.
            </p>

            <h2 className="text-purple-800">6. Changes to This Policy</h2>
            <p className="text-purple-800">
              We may update this Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page.
              You are advised to review this Privacy Policy periodically for any
              changes.
            </p>

            <h2 className="text-purple-800">7. Contact Us</h2>
            <p className="text-purple-800">
              If you have any questions about this Privacy Policy, please{' '}
              <a href="/contact" className="text-purple-600 hover:text-purple-700">contact us</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}