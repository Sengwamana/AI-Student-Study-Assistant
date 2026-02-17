import { Link } from "react-router-dom";

const openings = [
  { title: "Senior AI/ML Engineer", team: "AI Research", location: "Remote", type: "Full-time", desc: "Build and improve our adaptive tutoring models using state-of-the-art NLP techniques." },
  { title: "Full Stack Developer", team: "Engineering", location: "Remote", type: "Full-time", desc: "Design and build the platforms that millions of students use every day." },
  { title: "Product Designer", team: "Design", location: "Remote", type: "Full-time", desc: "Shape the learning experience with intuitive, accessible, and delightful interfaces." },
  { title: "Content Strategist", team: "Education", location: "Remote", type: "Full-time", desc: "Develop educational content frameworks and quality standards for AI-generated material." },
  { title: "DevOps Engineer", team: "Infrastructure", location: "Remote", type: "Full-time", desc: "Scale our infrastructure to serve millions of concurrent learners worldwide." },
  { title: "Growth Marketing Manager", team: "Marketing", location: "Remote", type: "Full-time", desc: "Drive user acquisition and engagement across student and educator segments." },
];

const perks = [
  { img: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&h=300&fit=crop", title: "Remote-First", desc: "Work from anywhere in the world" },
  { img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop", title: "Learning Budget", desc: "$2,000/year for courses and books" },
  { img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop", title: "Unlimited PTO", desc: "Take the time you need to recharge" },
  { img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop", title: "Competitive Pay", desc: "Top-of-market salary and equity" },
  { img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop", title: "Health & Wellness", desc: "Full medical, dental, and vision" },
  { img: "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?w=400&h=300&fit=crop", title: "Parental Leave", desc: "16 weeks paid leave for all parents" },
];

const CareersPage = () => {
  return (
    <main className="flex-1 animate-fade-in-up">
      {/* Hero with Background */}
      <section className="relative text-center py-16 sm:py-24 px-4 sm:px-6 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1400&h=600&fit=crop" 
          alt="Team working together" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-sm font-semibold mb-6">We're Hiring</span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-text-primary mb-6 leading-tight">
            Build the future of <span className="text-indigo-600">education</span>
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Join a team of passionate builders, educators, and dreamers who are making world-class learning accessible to everyone.
          </p>
        </div>
      </section>

      {/* Perks */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-surface-secondary">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-10 text-center">Why work with us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {perks.map((perk) => (
              <div key={perk.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-36 overflow-hidden">
                  <img src={perk.img} alt={perk.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-bold text-text-primary text-sm sm:text-base mb-1">{perk.title}</h3>
                  <p className="text-xs sm:text-sm text-text-secondary">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-[1000px] mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4 text-center">Open Positions</h2>
        <p className="text-text-secondary text-center mb-10">Find a role that matches your skills and passion.</p>
        <div className="space-y-4">
          {openings.map((job) => (
            <div key={job.title} className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group cursor-pointer">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <h3 className="font-bold text-text-primary text-lg group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold">{job.team}</span>
                  <span className="px-3 py-1 bg-gray-100 text-text-secondary rounded-full text-xs font-medium">{job.location}</span>
                  <span className="px-3 py-1 bg-gray-100 text-text-secondary rounded-full text-xs font-medium">{job.type}</span>
                </div>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{job.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <p className="text-text-secondary mb-4">Don't see your role? We'd still love to hear from you.</p>
          <Link to="/contact" className="inline-block px-8 py-3.5 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all hover:-translate-y-0.5 shadow-lg">
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  );
};

export default CareersPage;
