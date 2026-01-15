import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Shield, FileText, Phone, AlertTriangle, Lock, CheckCircle, Mail } from 'lucide-react';

export default function ConfidentialityPage() {
  const sections = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Scope of Confidentiality",
      content: "All information you share with your counselor, including your identity, the content of your sessions, and any personal records, is held in strict confidence. This applies to all forms of communication: in-person, online sessions, emails, and messages."
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Information We Collect",
      items: [
        {
          title: "Session Notes",
          description: "Your counselor may keep brief notes to track progress and ensure the continuity of care. These notes are professional records, stored securely, and are not shared."
        },
        {
          title: "Contact Information",
          description: "Your name, email, and phone number are used for scheduling and communication purposes only."
        }
      ]
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-accent" />,
      title: "Limits to Confidentiality",
      content: "While confidentiality is our standard, there are specific, legally mandated situations where we may be required to disclose information to the appropriate authorities:",
      items: [
        {
          title: "Risk of Harm to Self or Others",
          description: "If there is a serious risk of imminent harm to you or another person, we have a duty to take steps to prevent that harm."
        },
        {
          title: "Child Abuse or Neglect",
          description: "We are legally required to report any suspicion of abuse or neglect of a minor to the relevant child protective services."
        },
        {
          title: "Court Order",
          description: "If we receive a legal subpoena or court order, we may be required to release information. We will always take legal advice and aim to protect your privacy as much as legally possible."
        }
      ]
    },
    {
      icon: <Lock className="h-8 w-8 text-primary" />,
      title: "Data Security",
      content: "We use secure, encrypted platforms for online sessions and digital record-keeping. All physical records are stored in a locked and secure location. We take all reasonable steps to protect your information from unauthorized access."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      title: "Your Acknowledgment",
      content: "Before your first session, you will be asked to acknowledge that you have read and understood this confidentiality policy. This ensures we have a shared understanding of the therapeutic framework from the outset."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      
      {/* Added top padding to push the Heading down from navbar */}
      <div className="pt-16 sm:pt-2">
        <PageHeader
          title="Confidentiality Policy"
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
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            {item.title && (
                              <strong className="text-foreground font-medium block mb-1">{item.title}</strong>
                            )}
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
            <Card className="border border-primary/10 shadow-xl  hover:shadow-2xl transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                  <h3 className="text-lg font-headline text-primary">Questions About Confidentiality?</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  If you have any questions or concerns about our confidentiality practices, please don't hesitate to contact us.
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