interface AwarenessPageProps {
  params: {
    slug: string;
  };
}

export default async function AwarenessDetailPage({ 
    params,
 }: AwarenessPageProps) {

    const { slug } = await params;
    const formattedTitle = slug
        .split("-")
        .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");
        
  return (
  <main className="min-h-screen bg-lightBg px-6 py-20">
    <div className="max-w-5xl mx-auto space-y-16">

      {/* Header */}
      <section className="bg-white rounded-3xl p-10 shadow-lg">
        <h1 className="text-4xl font-bold text-primary mb-4">
          {formattedTitle}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Learn more about {formattedTitle.toLowerCase()}, understand common
          experiences, and explore how MindSettler supports individuals through
          awareness, guidance, and personalized mental well-being programs.
        </p>
      </section>

      {/* What is Section */}
      <section className="bg-white rounded-3xl p-10 shadow-sm">
        <h2 className="text-2xl font-semibold text-primary mb-4">
          What is {formattedTitle}?
        </h2>
        <p className="text-gray-600 leading-relaxed">
          {formattedTitle} is a mental health concern that can affect thoughts,
          emotions, and daily functioning. Everyone experiences it differently,
          and understanding it is the first step toward clarity and support.
        </p>
      </section>

      {/* Common Signs */}
      <section className="bg-white rounded-3xl p-10 shadow-sm">
        <h2 className="text-2xl font-semibold text-primary mb-6">
          Common Signs & Experiences
        </h2>
        <ul className="list-disc pl-6 space-y-3 text-gray-600">
          <li>Persistent emotional discomfort or distress</li>
          <li>Difficulty concentrating or making decisions</li>
          <li>Changes in sleep, energy, or motivation</li>
          <li>Feeling overwhelmed or disconnected</li>
        </ul>
      </section>

      {/* How MindSettler Helps */}
      <section className="bg-gradient-to-br from-softPurple/30 to-softPink/30 rounded-3xl p-10">
        <h2 className="text-2xl font-semibold text-primary mb-4">
          How MindSettler Helps
        </h2>
        <p className="text-gray-700 leading-relaxed">
          MindSettler provides a safe and confidential environment where
          individuals can explore their experiences through psycho-education,
          guided sessions, and personalized support — both online and offline.
        </p>
      </section>

      {/* Programs */}
      <section className="bg-white rounded-3xl p-10 shadow-sm">
        <h2 className="text-2xl font-semibold text-primary mb-6">
          Programs We Offer
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-2xl p-6">
            <h3 className="font-semibold text-primary mb-2">
              Awareness Sessions
            </h3>
            <p className="text-gray-600">
              Structured sessions focused on understanding emotions and
              developing healthy coping strategies.
            </p>
          </div>

          <div className="border rounded-2xl p-6">
            <h3 className="font-semibold text-primary mb-2">
              Personalized Guidance
            </h3>
            <p className="text-gray-600">
              One-on-one or group sessions tailored to individual needs and life
              challenges.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-2xl font-semibold text-primary mb-4">
          You Don’t Have to Navigate This Alone
        </h2>
        <p className="text-gray-600 mb-6">
          Seeking awareness and guidance is a positive step toward mental
          well-being.
        </p>

        <button className="px-10 py-3 rounded-full bg-primary text-white font-medium shadow-md hover:shadow-xl hover:scale-105 transition-all">
          Book a Session
        </button>
      </section>

    </div>
  </main>
);

}
