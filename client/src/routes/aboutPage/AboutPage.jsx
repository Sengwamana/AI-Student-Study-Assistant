import { Link } from "react-router-dom";

const team = [
  { name: "Amara Osei", role: "CEO & Co-Founder", bio: "Former ML researcher at DeepMind. Passionate about democratizing education through AI.", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop&crop=face" },
  { name: "Liam Chen", role: "CTO & Co-Founder", bio: "Ex-Google engineer with 12+ years building scalable learning platforms.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" },
  { name: "Sofia Martinez", role: "Head of Product", bio: "EdTech veteran who's shaped products used by millions of students worldwide.", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face" },
  { name: "Kwame Asante", role: "Head of AI Research", bio: "PhD in NLP from Stanford. Leading the development of our adaptive tutoring models.", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face" },
  { name: "Priya Sharma", role: "Head of Design", bio: "Award-winning designer focused on creating delightful learning experiences.", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face" },
  { name: "Marcus Johnson", role: "VP of Engineering", bio: "Scaling engineering teams and infrastructure to serve millions of learners.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face" },
];

const values = [
  { img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop", title: "Mission First", desc: "Every decision starts with one question: does this help students learn better?" },
  { img: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400&h=300&fit=crop", title: "Access for All", desc: "World-class education shouldn't depend on your zip code or income level." },
  { img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop", title: "Research-Driven", desc: "Our methods are grounded in cognitive science and evidence-based learning." },
  { img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop", title: "Community", desc: "We build with students, educators, and institutions — not just for them." },
];

const AboutPage = () => {
  return (
    <main className="flex-1 animate-fade-in-up">
      {/* Hero */}
      <section className="text-center py-16 sm:py-24 px-4 sm:px-6 max-w-4xl mx-auto">
        <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-6">Our Story</span>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-text-primary mb-6 leading-tight">
          Making learning <span className="text-indigo-600">smarter</span>, not harder
        </h1>
        <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          We started Smart Learn Today because we believe every student deserves a personal tutor — 
          one that's available 24/7, adapts to how you learn, and never runs out of patience.
        </p>
      </section>

      {/* Stats */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-5xl font-bold mb-2">20M+</p>
            <p className="text-sm text-white/70">Students worldwide</p>
          </div>
          <div>
            <p className="text-3xl sm:text-5xl font-bold mb-2">150+</p>
            <p className="text-sm text-white/70">Countries reached</p>
          </div>
          <div>
            <p className="text-3xl sm:text-5xl font-bold mb-2">500M+</p>
            <p className="text-sm text-white/70">Questions answered</p>
          </div>
          <div>
            <p className="text-3xl sm:text-5xl font-bold mb-2">4.9★</p>
            <p className="text-sm text-white/70">Average rating</p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-text-primary mb-6">How it all started</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed">
              <p>
                In 2023, two college friends realized that the students who thrived weren't necessarily the smartest — 
                they were the ones who had access to great tutors. That insight sparked a question: 
                <strong className="text-text-primary"> what if every student had a brilliant tutor in their pocket?</strong>
              </p>
              <p>
                We built Smart Learn Today to bridge the gap between students who have access to premium education 
                resources and those who don't. Using the latest advances in AI, we created a study assistant that 
                understands your learning style, adapts to your pace, and helps you truly understand — not just memorize.
              </p>
              <p>
                Today, we serve over 20 million students across 150+ countries, and we're just getting started.
              </p>
            </div>
          </div>
          <div className="flex-1 h-[300px] sm:h-[400px] w-full rounded-3xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop" 
              alt="Students collaborating on a campus" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-surface-secondary">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-text-primary mb-4 text-center">Our Values</h2>
          <p className="text-text-secondary text-center mb-12 max-w-xl mx-auto">The principles that guide everything we build.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="h-40 overflow-hidden">
                  <img src={v.img} alt={v.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-text-primary mb-2">{v.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-text-primary mb-4 text-center">Meet the Team</h2>
        <p className="text-text-secondary text-center mb-12 max-w-xl mx-auto">Builders, educators, and dreamers working to transform learning.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <div key={member.name} className="bg-surface-secondary p-6 rounded-2xl border border-gray-100 text-center hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-2 border-white shadow-md">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-text-primary">{member.name}</h3>
              <p className="text-sm text-indigo-600 font-medium mb-3">{member.role}</p>
              <p className="text-sm text-text-secondary leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 text-center text-white rounded-t-[3rem] mx-2 sm:mx-4 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1400&h=600&fit=crop" 
          alt="Students in a lecture hall" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-700/90"></div>
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold mb-4">Join our mission</h2>
          <p className="text-lg text-white/70 mb-8 max-w-lg mx-auto">Help us make world-class education accessible to every student, everywhere.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/sign-up" className="px-8 py-3.5 bg-white text-indigo-600 rounded-full font-semibold hover:bg-gray-50 transition-all hover:-translate-y-0.5 shadow-lg">
              Get Started Free
            </Link>
            <Link to="/careers" className="px-8 py-3.5 border border-white/30 rounded-full font-semibold hover:bg-white/10 transition-all hover:-translate-y-0.5">
              View Open Roles
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
