
const SolutionsPage = () => {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-10 text-center animate-fade-in-up">
      <h1 className="text-5xl font-serif font-medium mb-4">Solutions</h1>
      <p className="text-xl text-text-secondary max-w-2xl">
        Tailored solutions for students, educators, and institutions.
      </p>
      
      <div className="flex flex-col gap-20 mt-16 max-w-7xl w-full">
         
         {/* For Students */}
         <div className="bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-indigo-100/50 flex flex-col md:flex-row gap-12 items-center text-left">
            <div className="flex-1">
               <h2 className="text-3xl font-bold mb-4 text-text-primary">For Students</h2>
               <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                  Boost your grades and save time with a study assistant that adapts to you. 
                  From homework help to exam prep, we've got you covered.
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                     <span className="text-indigo-600 font-bold text-xl">01</span>
                     <div>
                        <h4 className="font-semibold text-text-primary">Exam Prep</h4>
                        <p className="text-sm text-text-secondary">Targeted practice questions.</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-3">
                     <span className="text-indigo-600 font-bold text-xl">02</span>
                     <div>
                        <h4 className="font-semibold text-text-primary">Homework Help</h4>
                        <p className="text-sm text-text-secondary">Step-by-step guidance.</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-3">
                     <span className="text-indigo-600 font-bold text-xl">03</span>
                     <div>
                        <h4 className="font-semibold text-text-primary">Concept Viz</h4>
                        <p className="text-sm text-text-secondary">Visual learning aids.</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-3">
                     <span className="text-indigo-600 font-bold text-xl">04</span>
                     <div>
                        <h4 className="font-semibold text-text-primary">Progress Tracking</h4>
                        <p className="text-sm text-text-secondary">See how you improve.</p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="flex-1 h-80 rounded-3xl overflow-hidden">
                <img src="/solutions_students.jpg" alt="Students collaborating" className="w-full h-full object-cover" />
            </div>
         </div>
         
         {/* For Educators */}
         <div className="bg-indigo-600 text-white p-12 rounded-[2.5rem] shadow-2xl shadow-indigo-500/30 flex flex-col md:flex-row-reverse gap-12 items-center text-left">
            <div className="flex-1">
               <h2 className="text-3xl font-bold mb-4">For Educators</h2>
               <p className="text-indigo-100 mb-8 leading-relaxed">
                  Empower your classroom with AI tools that help you track progress, generate lesson plans, 
                  and provide instant feedback to students. Focus on teaching, not grading.
               </p>
               <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">✨</div>
                     <span>Automated grading and feedback</span>
                  </li>
                  <li className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">📊</div>
                     <span>Real-time class analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">📝</div>
                     <span>AI-generated lesson plans & quizzes</span>
                  </li>
               </ul>
            </div>
            <div className="flex-1 h-80 rounded-3xl overflow-hidden border border-white/20">
                <img src="/solutions_educators.jpg" alt="Educator in classroom" className="w-full h-full object-cover" />
            </div>
         </div>

         {/* For Institutions */}
         <div className="bg-surface-secondary p-12 rounded-[2.5rem] border border-gray-100 flex flex-col md:flex-row gap-12 items-center text-left">
            <div className="flex-1">
               <h2 className="text-3xl font-bold mb-4 text-text-primary">For Institutions</h2>
               <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                  Deploy Smart Learn Today across your entire school or district. 
                  Get enterprise-grade security, integration with your LMS, and comprehensive insights.
               </p>
               <div className="flex gap-4">
                  <button className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors">Request Demo</button>
                  <button className="px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-white transition-colors">Contact Sales</button>
               </div>
            </div>
            <div className="flex-1 h-80 rounded-3xl overflow-hidden">
                <img src="/solutions_institutions.jpg" alt="University campus" className="w-full h-full object-cover" />
            </div>
         </div>

      </div>
    </main>
  );
};

export default SolutionsPage;
