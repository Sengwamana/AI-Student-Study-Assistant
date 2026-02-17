const contactMethods = [
  { img: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=300&fit=crop", title: "Email Us", info: "support@smartlearntoday.com", desc: "For general inquiries and support", action: "mailto:support@smartlearntoday.com" },
  { img: "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=400&h=300&fit=crop", title: "Live Chat", info: "Available 9am — 6pm EST", desc: "Get instant help from our team", action: "#" },
  { img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop", title: "Social Media", info: "@SmartLearnToday", desc: "Follow us for updates and tips", action: "#" },
];

const faqs = [
  { q: "How quickly do you respond to emails?", a: "We aim to respond within 24 hours on business days. Priority support members get responses within 4 hours." },
  { q: "Do you offer phone support?", a: "Currently, we offer email and live chat support. Phone support is available for Enterprise plan customers." },
  { q: "I'm having a technical issue. What should I include?", a: "Please include your browser type, device, a description of the issue, and any screenshots. This helps us resolve issues faster." },
];

const ContactPage = () => {
  return (
    <main className="flex-1 animate-fade-in-up">
      {/* Hero */}
      <section className="text-center py-16 sm:py-24 px-4 sm:px-6 max-w-4xl mx-auto">
        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6">Contact</span>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-text-primary mb-6 leading-tight">
          We'd love to <span className="text-indigo-600">hear</span> from you
        </h1>
        <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Have a question, feedback, or partnership idea? Reach out and we'll get back to you as soon as we can.
        </p>
      </section>

      {/* Contact Methods */}
      <section className="px-4 sm:px-6 pb-8 max-w-[1000px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-16">
          {contactMethods.map((method) => (
            <a key={method.title} href={method.action} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-center hover:shadow-md hover:border-indigo-200 hover:-translate-y-1 transition-all block">
              <div className="h-36 overflow-hidden">
                <img src={method.img} alt={method.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-text-primary mb-1">{method.title}</h3>
                <p className="text-sm text-indigo-600 font-semibold mb-2">{method.info}</p>
                <p className="text-xs text-text-muted">{method.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-24 max-w-[800px] mx-auto">
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-6">Send us a message</h2>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-1.5">First Name</label>
                <input type="text" placeholder="John" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-1.5">Last Name</label>
                <input type="text" placeholder="Doe" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1.5">Email</label>
              <input type="email" placeholder="john@university.edu" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1.5">Subject</label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all bg-white text-text-primary">
                <option>General Inquiry</option>
                <option>Technical Support</option>
                <option>Partnership</option>
                <option>Enterprise Sales</option>
                <option>Press & Media</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-1.5">Message</label>
              <textarea rows={5} placeholder="Tell us what's on your mind..." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none" />
            </div>
            <button type="submit" className="w-full sm:w-auto px-8 py-3.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all hover:-translate-y-0.5 shadow-lg">
              Send Message
            </button>
          </form>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-6 text-center">Frequently Asked</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-surface-secondary p-5 sm:p-6 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-text-primary mb-2">{faq.q}</h4>
                <p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
