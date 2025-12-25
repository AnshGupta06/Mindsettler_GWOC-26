import { PageHeader } from '../../components/shared/PageHeader';

export default function ConfidentialityPage() {
  return (
    <>
      <PageHeader
        title="Confidentiality Policy"
        subtitle="Your privacy is the foundation of our therapeutic relationship."
      />

      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="prose prose-lg mx-auto max-w-none text-purple-900 prose-headings:font-headline prose-headings:text-purple-800 prose-a:text-purple-600 hover:prose-a:text-purple-700 prose-strong:text-purple-800 prose-li:text-purple-800 prose-ol:text-purple-800">
            <p className="text-purple-800">
              At MindBloom, we are committed to maintaining the highest standards
              of confidentiality. We understand that the trust and safety of our
              clients are paramount. This policy outlines our commitment to
              protecting your privacy.
            </p>

            <h2 className="text-purple-800">Scope of Confidentiality</h2>
            <p className="text-purple-800">
              All information you share with your counselor, including your
              identity, the content of your sessions, and any personal records,
              is held in strict confidence. This applies to all forms of
              communication: in-person, online sessions, emails, and messages.
            </p>

            <h2 className="text-purple-800">Information We Collect</h2>
            <ul className="text-purple-800">
              <li>
                <strong>Session Notes:</strong> Your counselor may keep brief
                notes to track progress and ensure the continuity of care.
                These notes are professional records, stored securely, and are
                not shared.
              </li>
              <li>
                <strong>Contact Information:</strong> Your name, email, and
                phone number are used for scheduling and communication purposes
                only.
              </li>
            </ul>

            <h2 className="text-purple-800">Limits to Confidentiality</h2>
            <p className="text-purple-800">
              While confidentiality is our standard, there are specific, legally
              mandated situations where we may be required to disclose
              information to the appropriate authorities:
            </p>
            <ol className="text-purple-800">
              <li>
                <strong>Risk of Harm to Self or Others:</strong> If there is a
                serious risk of imminent harm to you or another person, we have
                a duty to take steps to prevent that harm.
              </li>
              <li>
                <strong>Child Abuse or Neglect:</strong> We are legally required
                to report any suspicion of abuse or neglect of a minor to the
                relevant child protective services.
              </li>
              <li>
                <strong>Court Order:</strong> If we receive a legal subpoena or
                court order, we may be required to release information. We will
                always take legal advice and aim to protect your privacy as much
                as legally possible.
              </li>
            </ol>

            <h2 className="text-purple-800">Data Security</h2>
            <p className="text-purple-800">
              We use secure, encrypted platforms for online sessions and digital
              record-keeping. All physical records are stored in a locked and
              secure location. We take all reasonable steps to protect your
              information from unauthorized access.
            </p>

            <h2 className="text-purple-800">Your Acknowledgment</h2>
            <p className="text-purple-800">
              Before your first session, you will be asked to acknowledge that
              you have read and understood this confidentiality policy. This
              ensures we have a shared understanding of the therapeutic framework
              from the outset.
            </p>

            <h2 className="text-purple-800">Contact Us</h2>
            <p className="text-purple-800">
              If you have any questions or concerns about our confidentiality
              practices, please do not hesitate to{' '}
              <a href="/contact" className="text-purple-600 hover:text-purple-700">contact us</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}