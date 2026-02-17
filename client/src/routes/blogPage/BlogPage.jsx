import { Link } from "react-router-dom";

const featured = {
  title: "How AI is Revolutionizing the Way Students Study in 2026",
  excerpt: "From personalized tutoring to instant feedback, artificial intelligence is transforming education. Here's what every student and educator needs to know.",
  category: "AI & Education",
  date: "Feb 15, 2026",
  readTime: "8 min read",
  image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
};

const posts = [
  { title: "5 Science-Backed Study Techniques That Actually Work", category: "Study Tips", date: "Feb 12, 2026", readTime: "5 min", img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop" },
  { title: "How to Use Active Recall to Ace Your Exams", category: "Study Tips", date: "Feb 10, 2026", readTime: "6 min", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop" },
  { title: "Why Spaced Repetition is the Secret to Long-Term Memory", category: "Learning Science", date: "Feb 8, 2026", readTime: "7 min", img: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400&h=300&fit=crop" },
  { title: "Smart Learn Today Hits 20 Million Students Worldwide", category: "Company News", date: "Feb 5, 2026", readTime: "3 min", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop" },
  { title: "Introducing Flashcards: Turn Notes into Memory Cards Instantly", category: "Product Update", date: "Feb 1, 2026", readTime: "4 min", img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop" },
  { title: "The Complete Guide to Using AI for Homework Help", category: "AI & Education", date: "Jan 28, 2026", readTime: "10 min", img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop" },
  { title: "How Educators Can Leverage AI Without Losing the Human Touch", category: "For Educators", date: "Jan 25, 2026", readTime: "7 min", img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop" },
  { title: "Exam Season Survival Kit: Tips from Top Students", category: "Study Tips", date: "Jan 20, 2026", readTime: "6 min", img: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=300&fit=crop" },
  { title: "Behind the Scenes: How We Built Our Quiz Generator", category: "Engineering", date: "Jan 15, 2026", readTime: "8 min", img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop" },
];

const categories = ["All", "Study Tips", "AI & Education", "Product Update", "Company News", "Learning Science", "For Educators", "Engineering"];

const BlogPage = () => {
  return (
    <main className="flex-1 animate-fade-in-up">
      {/* Hero */}
      <section className="text-center py-16 sm:py-24 px-4 sm:px-6 max-w-4xl mx-auto">
        <span className="inline-block px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-sm font-semibold mb-6">Blog</span>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-text-primary mb-6 leading-tight">
          Insights for <span className="text-indigo-600">smarter</span> learning
        </h1>
        <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Study tips, product updates, learning science, and stories from the Smart Learn Today team.
        </p>
      </section>

      {/* Content */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-24 max-w-[1200px] mx-auto">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                i === 0
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl overflow-hidden text-white mb-12 flex flex-col md:flex-row items-stretch cursor-pointer hover:shadow-2xl transition-shadow">
          <div className="flex-1 p-6 sm:p-10 flex flex-col justify-center">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold mb-4 w-fit">{featured.category}</span>
            <h2 className="text-xl sm:text-3xl font-bold mb-4 leading-snug">{featured.title}</h2>
            <p className="text-white/70 leading-relaxed mb-6">{featured.excerpt}</p>
            <div className="flex items-center gap-3 text-sm text-white/50">
              <span>{featured.date}</span>
              <span>•</span>
              <span>{featured.readTime}</span>
            </div>
          </div>
          <div className="w-full md:w-80 h-56 md:h-auto shrink-0">
            <img src={featured.image} alt={featured.title} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article key={post.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group overflow-hidden">
              <div className="w-full h-44 overflow-hidden">
                <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold mb-3">{post.category}</span>
                <h3 className="font-bold text-text-primary mb-3 leading-snug group-hover:text-indigo-600 transition-colors">{post.title}</h3>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="px-8 py-3.5 border border-gray-200 rounded-full font-semibold text-text-secondary hover:bg-gray-50 hover:border-gray-300 transition-all">
            Load More Articles
          </button>
        </div>
      </section>
    </main>
  );
};

export default BlogPage;
