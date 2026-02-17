
const DevelopersPage = () => {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-10 text-center animate-fade-in-up">
      <h1 className="text-5xl font-serif font-medium mb-4">Developers</h1>
      <p className="text-xl text-text-secondary max-w-2xl">
        Integrate Smart Learn Today's powerful AI capabilities into your own applications.
      </p>
      
      <div className="flex flex-col gap-24 mt-16 max-w-7xl w-full text-left">
         
         {/* API Introduction */}
         <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
               <h2 className="text-3xl font-bold mb-4 text-text-primary">Build with our API</h2>
               <p className="text-lg text-text-secondary mb-6 leading-relaxed">
                  Access the same state-of-the-art study AI that powers our platform. 
                  Create custom educational tools, tutoring bots, or content generators with just a few lines of code.
               </p>
               <div className="flex gap-4">
                  <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">Get API Keys</button>
                  <button className="px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-white transition-colors">Read Docs</button>
               </div>
            </div>
            <div className="flex-1 bg-[#1e1e1e] p-6 rounded-3xl shadow-xl overflow-hidden font-mono text-sm">
               <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
               </div>
               <code className="text-gray-300">
                  <span className="text-purple-400">const</span> response = <span className="text-purple-400">await</span> smartLearn.<span className="text-blue-400">generateQuiz</span>({'{'}<br/>
                  &nbsp;&nbsp;topic: <span className="text-green-400">"Quantum Physics"</span>,<br/>
                  &nbsp;&nbsp;difficulty: <span className="text-green-400">"hard"</span>,<br/>
                  &nbsp;&nbsp;count: <span className="text-orange-400">10</span><br/>
                  {'}'});<br/><br/>
                  console.<span className="text-blue-400">log</span>(response.questions);
               </code>
            </div>
         </div>

         {/* Use Cases */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-surface-secondary border border-gray-100">
               <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-6">📱</div>
               <h3 className="text-xl font-bold mb-3">EdTech Apps</h3>
               <p className="text-text-secondary">Enhance your existing education app with AI-powered explanations and quizzes.</p>
            </div>
            <div className="p-8 rounded-3xl bg-surface-secondary border border-gray-100">
               <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-2xl mb-6">🏫</div>
               <h3 className="text-xl font-bold mb-3">LMS Integration</h3>
               <p className="text-text-secondary">Seamlessly integrate smart study tools directly into your Learning Management System.</p>
            </div>
            <div className="p-8 rounded-3xl bg-surface-secondary border border-gray-100">
               <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center text-2xl mb-6">🤖</div>
               <h3 className="text-xl font-bold mb-3">Tutoring Bots</h3>
               <p className="text-text-secondary">Build specialized tutoring bots for specific subjects like Math, Coding, or History.</p>
            </div>
         </div>

      </div>
    </main>
  );
};

export default DevelopersPage;
