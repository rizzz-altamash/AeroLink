/* eslint-disable */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/30 via-gray-950 to-emerald-950/30"></div>
        
        {/* Animated Drone Paths */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <path id="dronePath1" d="M0,200 Q400,100 800,200 T1600,200" />
            <path id="dronePath2" d="M0,400 Q400,300 800,400 T1600,400" />
            <path id="dronePath3" d="M0,600 Q400,500 800,600 T1600,600" />
          </defs>
          
          <g className="opacity-20">
            <circle r="4" fill="#10b981">
              <animateMotion dur="30s" repeatCount="indefinite">
                <mpath href="#dronePath1" />
              </animateMotion>
            </circle>
            <circle r="4" fill="#34d399">
              <animateMotion dur="35s" repeatCount="indefinite">
                <mpath href="#dronePath2" />
              </animateMotion>
            </circle>
            <circle r="4" fill="#6ee7b7">
              <animateMotion dur="40s" repeatCount="indefinite">
                <mpath href="#dronePath3" />
              </animateMotion>
            </circle>
          </g>

          {/* Drone Flight Lines */}
          <path d="M0,200 Q400,100 800,200 T1600,200" stroke="#10b981" strokeWidth="1" fill="none" opacity="0.1" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
          </path>
          <path d="M0,400 Q400,300 800,400 T1600,400" stroke="#34d399" strokeWidth="1" fill="none" opacity="0.1" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" from="0" to="10" dur="2s" repeatCount="indefinite" />
          </path>
          <path d="M0,600 Q400,500 800,600 T1600,600" stroke="#34d399" strokeWidth="1" fill="none" opacity="0.1" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1.5s" repeatCount="indefinite" />
          </path>
        </svg>

        {/* Floating Elements */}
        <div className="absolute top-20 right-20 animate-float">
          <DroneIcon className="w-32 h-32 text-green-500/10" />
        </div>
        <div className="absolute bottom-20 left-20 animate-float-delayed">
          <MedicalIcon className="w-40 h-40 text-emerald-500/10" />
        </div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/90 backdrop-blur-xl border-b border-green-500/20' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <DroneIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AeroMed</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-green-400 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-green-400 transition-colors">How It Works</a>
              <a href="#benefits" className="text-gray-300 hover:text-green-400 transition-colors">Benefits</a>
              <a href="#contact" className="text-gray-300 hover:text-green-400 transition-colors">Contact</a>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/auth/signin"
                className="text-green-400 hover:text-green-300 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup"
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-500/25"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Revolutionizing Medical Deliveries</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                The Future of 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400"> Medical Delivery</span> 
                <br />is in the Air
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Lightning-fast autonomous drone deliveries for hospitals. 
                Delivering critical medical supplies, blood, and medications when every second counts.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => router.push('/auth/signup')}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-500/25 group"
                >
                  <span className="flex items-center justify-center gap-2">
                    Start Free Trial
                    <ArrowIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button className="px-8 py-4 bg-gray-800/50 backdrop-blur hover:bg-gray-700/50 text-white font-semibold rounded-xl transition-all border border-green-500/20">
                  Watch Demo
                </button>
              </div>
              
              <div className="flex items-center gap-8 mt-12">
                <div>
                  <p className="text-3xl font-bold text-white">15min</p>
                  <p className="text-gray-400 text-sm">Avg. Delivery Time</p>
                </div>
                <div className="w-px h-12 bg-gray-700"></div>
                <div>
                  <p className="text-3xl font-bold text-white">99.9%</p>
                  <p className="text-gray-400 text-sm">Success Rate</p>
                </div>
                <div className="w-px h-12 bg-gray-700"></div>
                <div>
                  <p className="text-3xl font-bold text-white">24/7</p>
                  <p className="text-gray-400 text-sm">Availability</p>
                </div>
              </div>
            </div>
            
            <div className="relative animate-fade-in-up animation-delay-200">
              <div className="relative z-10">
                <img 
                  src="/api/placeholder/600/400" 
                  alt="Fixed Wing V-TOL UAV"
                  className="rounded-2xl shadow-2xl border border-green-500/20"
                />
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-slow">
                  <SpeedIcon className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-emerald-600/20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400"> AeroMed</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our Fixed Wing V-TOL UAV technology ensures the fastest, safest, and most reliable medical deliveries
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={LightningIcon}
              title="Ultra-Fast Delivery"
              description="Average delivery time of 15 minutes within 50km radius. No traffic, no delays."
              gradient="from-yellow-600 to-orange-600"
              delay="0"
            />
            <FeatureCard
              icon={ShieldIcon}
              title="Secure & Reliable"
              description="Temperature-controlled cargo bay, real-time tracking, and 99.9% delivery success rate."
              gradient="from-blue-600 to-cyan-600"
              delay="100"
            />
            <FeatureCard
              icon={ClockIcon}
              title="24/7 Operations"
              description="Round-the-clock availability for emergency medical supplies and critical deliveries."
              gradient="from-purple-600 to-pink-600"
              delay="200"
            />
            <FeatureCard
              icon={RouteIcon}
              title="Optimized Routes"
              description="AI-powered route optimization avoiding obstacles and weather conditions."
              gradient="from-green-600 to-emerald-600"
              delay="300"
            />
            <FeatureCard
              icon={EcoIcon}
              title="Eco-Friendly"
              description="Zero-emission electric drones reducing carbon footprint by 84% compared to traditional delivery."
              gradient="from-teal-600 to-green-600"
              delay="400"
            />
            <FeatureCard
              icon={ScaleIcon}
              title="Scalable Solution"
              description="From single urgent deliveries to bulk medical supply distribution across multiple facilities."
              gradient="from-red-600 to-rose-600"
              delay="500"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 py-20 px-4 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-400">Simple, efficient, and automated delivery process</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <StepCard
              number="1"
              title="Place Order"
              description="Hospital staff creates delivery request through our platform"
              icon={OrderIcon}
              delay="0"
            />
            <StepCard
              number="2"
              title="Drone Assignment"
              description="AI assigns the nearest available drone and plans optimal route"
              icon={DroneAssignIcon}
              delay="100"
            />
            <StepCard
              number="3"
              title="Secure Pickup"
              description="Drone arrives at pickup point, package is loaded securely"
              icon={PackageIcon}
              delay="200"
            />
            <StepCard
              number="4"
              title="Swift Delivery"
              description="Real-time tracking until safe delivery at destination"
              icon={DeliveryIcon}
              delay="300"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <h2 className="text-4xl font-bold text-white mb-8">
                Transforming Healthcare
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400"> Logistics</span>
              </h2>
              
              <div className="space-y-6">
                <BenefitItem
                  title="Save Lives"
                  description="Deliver critical supplies in minutes, not hours. Every second counts in medical emergencies."
                />
                <BenefitItem
                  title="Reduce Costs"
                  description="Cut delivery costs by up to 60% compared to traditional ground transportation."
                />
                <BenefitItem
                  title="Expand Reach"
                  description="Access remote and hard-to-reach areas where traditional vehicles can't go."
                />
                <BenefitItem
                  title="Real-time Visibility"
                  description="Track every delivery with precision GPS and get instant notifications."
                />
              </div>
            </div>
            
            <div className="relative animate-fade-in-up animation-delay-200">
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-green-500/20">
                <h3 className="text-2xl font-bold text-white mb-6">By the Numbers</h3>
                <div className="space-y-6">
                  <StatItem label="Deliveries Completed" value="50,000+" />
                  <StatItem label="Partner Hospitals" value="150+" />
                  <StatItem label="Lives Impacted" value="1M+" />
                  <StatItem label="Cities Covered" value="25" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20 px-4 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-white mb-4">What Hospitals Say</h2>
            <p className="text-xl text-gray-400">Trusted by leading medical institutions</p>
          </div>
          
          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                {...testimonial}
                isActive={activeTestimonial === index}
              />
            ))}
          </div>
          
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeTestimonial === index ? 'w-8 bg-green-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl rounded-3xl p-12 border border-green-500/20 text-center animate-fade-in-up">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Medical Deliveries?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the revolution in healthcare logistics. Start your free trial today and experience the future of medical deliveries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/auth/signup?type=hospital')}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-500/25"
              >
                Start Free Trial
              </button>
              <button className="px-8 py-4 bg-gray-800/50 backdrop-blur hover:bg-gray-700/50 text-white font-semibold rounded-xl transition-all border border-green-500/20">
                Schedule Demo
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-6">
              No credit card required • 30-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                  <DroneIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">AeroMed</span>
              </div>
              <p className="text-gray-400 text-sm">
                Revolutionizing medical deliveries with autonomous drone technology.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Case Studies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">API Docs</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Status</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Terms & Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 AeroMed. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <LinkedInIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <GitHubIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animation-delay-200 { animation-delay: 200ms; }
      `}</style>
    </div>
  );
}

// Component definitions
function FeatureCard({ icon: Icon, title, description, gradient, delay }) {
  return (
    <div 
      className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-green-500/20 hover:border-green-500/30 transition-all group hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description, icon: Icon, delay }) {
  return (
    <div 
      className="text-center animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-gray-800/50 backdrop-blur rounded-2xl flex items-center justify-center mx-auto border border-green-500/20">
          <Icon className="w-10 h-10 text-green-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {number}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

function BenefitItem({ title, description }) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
        <CheckIcon className="w-6 h-6 text-green-400" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="flex justify-between items-end">
      <span className="text-gray-400">{label}</span>
      <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
        {value}
      </span>
    </div>
  );
}

function TestimonialCard({ quote, author, role, hospital, isActive }) {
  return (
    <div className={`absolute inset-0 transition-all duration-500 ${
      isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
    }`}>
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-green-500/20">
        <QuoteIcon className="w-12 h-12 text-green-500/20 mb-4" />
        <p className="text-xl text-gray-300 mb-6 italic">{quote}</p>
        <div>
          <p className="text-white font-semibold">{author}</p>
          <p className="text-gray-400 text-sm">{role}</p>
          <p className="text-green-400 text-sm">{hospital}</p>
        </div>
      </div>
    </div>
  );
}

// Icon Components
const DroneIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const MedicalIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3zM2 12v2h8v-2z M13 2v8h8V2z M14 9V3h6v6z" />
  </svg>
);

const ArrowIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4-4m0 0l-4-4m4 4H3" />
  </svg>
);

const LightningIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ShieldIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RouteIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const EcoIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ScaleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>
);

const OrderIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const DroneAssignIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PackageIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const DeliveryIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const SpeedIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const QuoteIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
);

const TwitterIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const LinkedInIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const GitHubIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

// Testimonial data
const testimonials = [
  {
    quote: "AeroMed has revolutionized our emergency response capabilities. We've reduced critical delivery times by 75% and saved countless lives in the process.",
    author: "Dr. Sarah Chen",
    role: "Chief Medical Officer",
    hospital: "Metro General Hospital"
  },
  {
    quote: "The reliability and speed of drone deliveries have transformed how we manage our medical inventory. It's not just faster, it's a complete paradigm shift.",
    author: "James Rodriguez",
    role: "Head of Operations",
    hospital: "St. Mary's Medical Center"
  },
  {
    quote: "In rural healthcare, every minute matters. AeroMed's drones reach our remote facilities faster than any ground transport ever could.",
    author: "Dr. Amara Patel",
    role: "Director of Emergency Services",
    hospital: "Regional Health Network"
  }
];