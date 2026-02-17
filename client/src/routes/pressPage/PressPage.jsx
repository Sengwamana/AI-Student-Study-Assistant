const pressReleases = [
  { date: "Feb 2026", title: "Smart Learn Today Surpasses 20 Million Students Globally", source: "Company Announcement" },
  { date: "Jan 2026", title: "Smart Learn Today Launches Flashcard Generator Powered by AI", source: "Product Update" },
  { date: "Dec 2025", title: "Series B: Smart Learn Today Raises $45M to Expand AI-Powered Learning", source: "TechCrunch" },
  { date: "Oct 2025", title: "Partnership with 500+ Universities Worldwide", source: "EdSurge" },
  { date: "Aug 2025", title: "Smart Learn Today Named Best EdTech Startup of 2025", source: "Forbes" },
];

const mediaKit = [
  { img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop", title: "Logo Pack", desc: "PNG, SVG in light & dark variants", format: "ZIP • 2.4 MB" },
  { img: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop", title: "Brand Guidelines", desc: "Colors, typography, and usage rules", format: "PDF • 1.8 MB" },
  { img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop", title: "Fact Sheet", desc: "Key stats, milestones, and mission", format: "PDF • 420 KB" },
  { img: "https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?w=400&h=300&fit=crop", title: "Product Screenshots", desc: "High-res UI screenshots for press", format: "ZIP • 15 MB" },
];

const PressPage = () => {
  return (
    <main className="flex-1 animate-fade-in-up">
      {/* Hero with Background */}
      <section className="relative text-center py-16 sm:py-24 px-4 sm:px-6 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=1400&h=600&fit=crop" 
          alt="News and media" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-50 text-purple-600 text-sm font-semibold mb-6">Press Kit</span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-text-primary mb-6 leading-tight">
            Smart Learn Today in the <span className="text-indigo-600">news</span>
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Download brand assets, read our latest announcements, and find everything you need to cover our story.
          </p>
        </div>
      </section>

      {/* Key Facts */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-900 text-white">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-bold mb-1">2023</p>
            <p className="text-sm text-white/50">Founded</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-bold mb-1">20M+</p>
            <p className="text-sm text-white/50">Students</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-bold mb-1">150+</p>
            <p className="text-sm text-white/50">Countries</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-bold mb-1">$65M</p>
            <p className="text-sm text-white/50">Total Funding</p>
          </div>
        </div>
      </section>

      {/* Media Kit Downloads */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-[1000px] mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4 text-center">Media Kit</h2>
        <p className="text-text-secondary text-center mb-10">Download assets for press coverage and partnerships.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {mediaKit.map((item) => (
            <div key={item.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row items-stretch hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group">
              <div className="w-full sm:w-32 h-32 sm:h-auto shrink-0 overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-center">
                <h3 className="font-bold text-text-primary group-hover:text-indigo-600 transition-colors">{item.title}</h3>
                <p className="text-sm text-text-secondary mb-2">{item.desc}</p>
                <span className="text-xs text-text-muted">{item.format}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-surface-secondary">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4 text-center">Press Releases</h2>
          <p className="text-text-secondary text-center mb-10">Our latest announcements and media coverage.</p>
          <div className="space-y-3">
            {pressReleases.map((pr) => (
              <div key={pr.title} className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3 hover:shadow-sm hover:border-indigo-200 transition-all cursor-pointer group">
                <span className="text-sm text-text-muted font-mono w-20 shrink-0">{pr.date}</span>
                <h3 className="flex-1 font-semibold text-text-primary group-hover:text-indigo-600 transition-colors">{pr.title}</h3>
                <span className="text-xs px-3 py-1 bg-gray-100 text-text-secondary rounded-full shrink-0">{pr.source}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 text-center max-w-[600px] mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">Press Inquiries</h2>
        <p className="text-text-secondary mb-6">For media inquiries, interviews, and press opportunities, please reach out to our communications team.</p>
        <a href="mailto:press@smartlearntoday.com" className="inline-block px-8 py-3.5 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all hover:-translate-y-0.5 shadow-lg">
          press@smartlearntoday.com
        </a>
      </section>
    </main>
  );
};

export default PressPage;
