
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, AiSparklesIcon, UsersIcon, SignatureIcon, SendIcon } from './Icons';


const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <AiSparklesIcon className="w-10 h-10 text-nimasa-green mb-4" />,
            title: 'AI-Powered Drafting',
            description: 'Generate structured report drafts instantly. Our AI assistant helps you overcome writer\'s block and ensures consistency across all documents.'
        },
        {
            icon: <UsersIcon className="w-10 h-10 text-nimasa-green mb-4" />,
            title: 'Real-Time Collaboration',
            description: 'Work together on reports seamlessly. See edits from your team as they happen and maintain a single source of truth for every event.'
        },
        {
            icon: <SignatureIcon className="w-10 h-10 text-nimasa-green mb-4" />,
            title: 'Secure Digital Signatures',
            description: 'Append verifiable digital signatures to authenticate and finalize reports, ensuring a clear, secure, and compliant chain of custody.'
        },
        {
            icon: <SendIcon className="w-10 h-10 text-nimasa-green mb-4" />,
            title: 'Streamlined Workflow',
            description: 'Automated routing from Staff to Coordinator to Director General, with notifications at every step to keep the process moving.'
        }
    ];

  // 
    const steps = [
      {
        number: "01.",
        title: "Create Report",
        description: "Start with pre-loaded templates or let AI generate a structured draft from your event data.",
      },
      {
        number: "02.",
        title: "Collaborate",
        description: "Multiple team members can co-edit in real-time with tracked contributions and suggestions.",
      },
      {
        number: "03.",
        title: "Review & Refine",
        description: "AI writing feedback engine improves clarity, grammar, and tone to meet official standards.",
      },
      {
        number: "04.",
        title: "Sign & Submit",
        description: "Apply digital signatures and automatically route to Zonal Coordinator and DG's Office.",
      },
    ];

    return (
        <div className="bg-nimasa-blue text-white font-sans">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-20">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Logo />
                    <button
                        onClick={() => navigate('/auth')}
                        className="bg-nimasa-green text-white font-semibold px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-300 shadow-lg"
                    >
                        Login / Sign Up
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <main>
                <section className="relative min-h-screen flex items-center justify-center pt-20 pb-10 bg-[url('https://www.transparenttextures.com/patterns/wave-grid.png')] bg-nimasa-blue">
                    <div className="absolute inset-0 bg-gradient-to-b from-nimasa-blue via-nimasa-blue/80 to-nimasa-dark opacity-90"></div>
                    <div className="container mx-auto px-6 text-center relative z-10">
                        <div className="animate-fade-in-up">
                            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
                                NIMASA Intelligent Report Management System
                            </h1>
                            <p className="text-xl md:text-2xl font-light text-gray-300 mb-8 max-w-3xl mx-auto">
                                From Reports to Intelligence — <span className="text-nimasa-green font-semibold">Powered by NIRMS.</span>
                            </p>
                            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
                                An AI-powered assistant that helps staff write, sign, and share official reports effortlessly.
                            </p>
                            <button
                                onClick={() => navigate('/auth')}
                                className="bg-nimasa-green text-white font-bold text-lg px-10 py-4 rounded-lg hover:bg-teal-600 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-teal-500/20"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-nimasa-dark">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-2">Empowering Maritime Excellence</h2>
                            <p className="text-lg text-gray-400">NIRMS is designed to be welcoming, trustworthy, and powerful.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
                                <div key={index} className="bg-nimasa-blue p-8 rounded-xl border border-nimasa-green/20 shadow-lg hover:border-nimasa-green/50 hover:-translate-y-2 transition-all duration-300">
                                    {feature.icon}
                                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it Works Section */}
              <section id="features" className="py-20 bg-nimasa-dark">
                      <div className="container mx-auto px-6">
                          <div className="text-center mb-12">
                              <h2 className="text-3xl md:text-4xl font-bold mb-2">How It Works</h2>
                              <p className="text-lg text-gray-400">Simple Process.</p>
                               <p className="text-lg text-gray-400">Four simple steps to transform your reporting workflow.</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                              {steps.map((step, index) => (
                                  <div key={index} className="bg-nimasa-blue p-8 rounded-xl border border-nimasa-green/20 shadow-lg hover:border-nimasa-green/50 hover:-translate-y-2 transition-all duration-300">
                                      {step.number}
                                      <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                      <p className="text-gray-400 leading-relaxed">{step.description}</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </section>
            </main>

            {/* Footer */}
            <footer className="bg-nimasa-blue py-6">
                <div className="container mx-auto px-6 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} NIMASA. All Rights Reserved. Powered by NIRMS.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
