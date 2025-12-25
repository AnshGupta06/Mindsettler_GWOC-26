import { PageHeader } from '../../components/shared/PageHeader';

export default function RefundPolicyPage() {
  return (
    <>
      <PageHeader
        title="Non-Refund Policy"
        subtitle="Our policy on session payments, cancellations, and rescheduling."
      />

      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="prose prose-lg mx-auto max-w-none text-purple-900 prose-headings:font-headline prose-headings:text-purple-800 prose-a:text-purple-600 hover:prose-a:text-purple-700 prose-strong:text-purple-800 prose-li:text-purple-800">
            <p className="text-purple-800">
              At MindBloom, we are committed to providing dedicated time and
              space for our clients. Our policy reflects the value of this
              commitment from both sides.
            </p>

            <h2 className="text-purple-800">1. Session Fees</h2>
            <p className="text-purple-800">
              All session fees must be paid in advance to confirm your
              appointment. An appointment is not considered confirmed until
              payment has been received. Payments for sessions are
              non-refundable.
            </p>

            <h2 className="text-purple-800">2. Cancellation and Rescheduling</h2>
            <p className="text-purple-800">
              We understand that unforeseen circumstances can arise. If you need
              to reschedule your appointment, we require at least{' '}
              <strong>24 hours' notice</strong> prior to your scheduled session
              time.
            </p>
            <ul className="text-purple-800">
              <li>
                <strong>With 24+ Hours' Notice:</strong> If you provide more
                than 24 hours' notice, you may reschedule your appointment to
                another available time slot without any penalty. Your prepaid
                fee will be applied to the new appointment.
              </li>
              <li>
                <strong>With Less Than 24 Hours' Notice:</strong>
                Cancellations or rescheduling requests made with less than 24
                hours' notice will result in the forfeiture of the session fee.
                This is because the time was specifically reserved for you, and
                it is often not possible to fill the slot at short notice.
              </li>
              <li>
                <strong>No-Shows:</strong> If you do not attend your scheduled
                appointment without any prior notice, the session fee will be
                forfeited.
              </li>
            </ul>

            <h2 className="text-purple-800">3. How to Reschedule</h2>
            <p className="text-purple-800">
              To reschedule your appointment, please contact us directly via
              email or phone as soon as possible.
            </p>

            <h2 className="text-purple-800">4. Exceptions</h2>
            <p className="text-purple-800">
              We may consider exceptions to this policy in cases of documented
              emergencies on a case-by-case basis.
            </p>

            <h2 className="text-purple-800">5. Contact Us</h2>
            <p className="text-purple-800">
              If you have any questions about this policy, please{' '}
              <a href="/contact" className="text-purple-600 hover:text-purple-700">contact us</a> before booking.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}