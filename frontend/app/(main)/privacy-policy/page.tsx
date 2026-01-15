import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Shield, Eye, Lock, Database, UserCheck, FileText, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: <Eye className="h-8 w-8 text-primary" />,
      title: "Information We Collect",
      content: "We may collect the following types of information:",
      items: [
        {
          title: "Personal Identification Information",
          description: "Name, email address, phone number, etc., that you provide when booking a session or contacting us."
        },
        {
          title: "Booking Information",
          description: "Details about the sessions you book, including date, time, and session type."
        },
        {
          title: "Communications",
          description: "Any information you provide when you communicate with us, including through our contact form or chatbot."
        }
      ]
    },
    {
      icon: <Database className="h-8 w-8 text-primary" />,
      title: "How We Use Your Information",
      content: "We use the information we collect to:",
      items: [
        { description: "Provide, operate, and maintain our services" },
        { description: "Process your bookings and manage your appointments" },
        { description: "Communicate with you, including sending confirmations and reminders" },
        { description: "Respond to your comments, questions, and requests" },
        { description: "Improve our website and services" }
      ]
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Information Sharing and Disclosure",
      content: "We do not sell or rent your personal information to third parties. Your information is treated as confidential and is subject to the terms of our Confidentiality Policy. We may only disclose information if required by law."
    },
    {
      icon: <Lock className="h-8 w-8 text-primary" />,
      title: "Data Security",
      content: "We implement a variety of security measures to maintain the safety of your personal information. We use secure platforms for data storage and communication to protect against unauthorized access, alteration, or disclosure."
    },
    {
      icon: <UserCheck className="h-8 w-8 text-primary" />,
      title: "Your Rights",
      content: "You have the right to access, update, or request deletion of your personal information. Please contact us to make such a request."
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Changes to This Policy",
      content: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      
      {/* Reduced padding here to bring the heading closer to the navbar */}
      <div className="pt-10 sm:pt-2">
        <PageHeader
          title="Privacy Policy"
        />
      </div>

      {/* Main content with negative margin to pull cards up towards the heading */}
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
                    <ul className="space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex gap-3">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            {'title' in item && item.title && (
                              <strong className="text-foreground font-medium">{item.title}:</strong>
                            )}
                            <span className="text-muted-foreground ml-1 leading-relaxed">{item.description}</span>
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
            <Card className="border border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  If you have any questions about this Privacy Policy, please don't hesitate to reach out.
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