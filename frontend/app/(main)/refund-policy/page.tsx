import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { CreditCard, Clock, RefreshCw, AlertCircle, Phone, Mail, CheckCircle } from 'lucide-react';

export default function RefundPolicyPage() {
  const sections = [
    {
      icon: <CreditCard className="h-8 w-8 text-primary" />,
      title: "Session Fees",
      content: "All session fees must be paid in advance to confirm your appointment. An appointment is not considered confirmed until payment has been received. Payments for sessions are non-refundable."
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Cancellation and Rescheduling",
      content: "We understand that unforeseen circumstances can arise. If you need to reschedule your appointment, we require at least 24 hours' notice prior to your scheduled session time.",
      items: [
        {
          title: "With 24+ Hours' Notice",
          description: "If you provide more than 24 hours' notice, you may reschedule your appointment to another available time slot without any penalty. Your prepaid fee will be applied to the new appointment.",
          type: "positive"
        },
        {
          title: "With Less Than 24 Hours' Notice",
          description: "Cancellations or rescheduling requests made with less than 24 hours' notice will result in the forfeiture of the session fee. This is because the time was specifically reserved for you, and it is often not possible to fill the slot at short notice.",
          type: "warning"
        },
        {
          title: "No-Shows",
          description: "If you do not attend your scheduled appointment without any prior notice, the session fee will be forfeited.",
          type: "warning"
        }
      ]
    },
    {
      icon: <RefreshCw className="h-8 w-8 text-primary" />,
      title: "How to Reschedule",
      content: "To reschedule your appointment, please contact us directly via email or phone as soon as possible."
    },
    {
      icon: <AlertCircle className="h-8 w-8 text-accent" />,
      title: "Exceptions",
      content: "We may consider exceptions to this policy in cases of documented emergencies on a case-by-case basis."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      
      {/* Added top padding to push the Heading down from navbar */}
      <div className="pt-16 sm:pt-2">
        <PageHeader
          title="Non-Refund Policy"
        />
      </div>

      {/* Added negative top margin to pull cards up towards the heading */}
      <section className="-mt-8 sm:-mt-12 pb-12 bg-gradient-to-b from-white to-lightBg relative z-10">
        <div className="container mx-auto max-w-4xl px-4">

          <div className="space-y-6">
            {sections.map((section, index) => (
              <Card key={index} className="border border-primary/10 shadow-xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-1">
                  <CardHeader className="pb-4 bg-white/95">
                    <CardTitle className="flex items-center gap-4 text-xl font-headline text-primary">
                      {section.icon}
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                </div>
                <CardContent className="pt-4">
                  <p className="text-muted-foreground mb-4 leading-relaxed">{section.content}</p>
                  {section.items && (
                    <ul className="space-y-4">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${item.type === 'positive' ? 'bg-green-500' : item.type === 'warning' ? 'bg-yellow-500' : 'bg-accent'}`}></div>
                          <div className="flex-1">
                            <strong className="text-foreground font-medium block mb-1">{item.title}</strong>
                            <span className="text-muted-foreground leading-relaxed">{item.description}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Card className="border border-primary/10 shadow-xl bg-gradient-to-r from-primary/5 to-accent/5 hover:shadow-2xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                  <h3 className="text-lg font-headline text-primary">Questions About Our Policy?</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about this policy, please contact us before booking.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-lg hover:shadow-xl"
                >
                  Contact Us
                  <Mail className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}