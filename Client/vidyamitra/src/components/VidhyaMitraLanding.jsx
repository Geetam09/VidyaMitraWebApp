import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Users, FileText, Brain, BarChart3, Globe, ArrowRight, Menu, X, Star, CheckCircle, Sparkles, Zap, Shield, TrendingUp } from 'lucide-react';

export default function VidhyaMitraLanding({ onLogin }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  const features = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Smart Assignment Creation",
      description: "Create and manage assignments with intuitive tools designed for rural education needs.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Generated Papers",
      description: "Generate question papers automatically using AI, tailored to your curriculum and difficulty level.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Student Data Management",
      description: "Efficiently track student progress, attendance, and performance with easy-to-use tools.",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Progress Analytics",
      description: "Visualize student performance and class statistics with comprehensive reporting tools.",
      color: "from-orange-500 to-red-500"
    }
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  const handleLogin = () => {
    if (onLogin) {
      onLogin(); // This will switch to the login page
    }
  };

  const FloatingOrb = ({ size, color, delay }) => (
    <div 
      className={`absolute rounded-full ${size} ${color} opacity-20 animate-pulse`}
      style={{
        animation: `float ${6 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`
      }}
    />
  );

  return (
    <div className="min-h-screen bg-black overflow-x-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`
          }}
        />
      </div>

      {/* Floating Orbs */}
      <FloatingOrb size="w-72 h-72" color="bg-gradient-to-r from-purple-600 to-pink-600" delay={0} />
      <FloatingOrb size="w-96 h-96" color="bg-gradient-to-r from-blue-600 to-cyan-600" delay={2} />
      <FloatingOrb size="w-64 h-64" color="bg-gradient-to-r from-green-600 to-teal-600" delay={4} />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 transition-all duration-500">
        <div className="bg-black/10 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-75" />
                  <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                </div>
                <span className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  VidhyaMitra
                </span>
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                {['Home', 'Features', 'About Us'].map((item, index) => (
                  <a 
                    key={item}
                    href={`#${item.toLowerCase().replace(' ', '')}`} 
                    className="relative text-white/80 hover:text-white transition-all duration-300 font-medium text-lg group"
                  >
                    {item}
                    <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300" />
                  </a>
                ))}
                <button 
                  onClick={handleLogin}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
                  <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold">
                    Login
                  </div>
                </button>
              </div>

              <div className="md:hidden">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white/80 hover:text-white transition-colors p-2"
                >
                  {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-black/20 backdrop-blur-xl border-t border-white/10">
              <div className="px-4 py-8 space-y-6">
                {['Home', 'Features', 'About Us'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase().replace(' ', '')}`} className="block text-white/80 hover:text-white transition-colors font-medium text-xl">
                    {item}
                  </a>
                ))}
                <button 
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full hover:shadow-2xl transition-all duration-300 font-semibold text-lg"
                >
                  Login
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" ref={heroRef} className="relative pt-32 pb-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-20 items-center">
            <div className="mb-16 lg:mb-0">
              <div 
                className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 mb-8 group hover:bg-white/10 transition-all duration-500"
                style={{ transform: `translateY(${scrollY * -0.1}px)` }}
              >
                <div className="relative">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  <div className="absolute inset-0 bg-cyan-400 rounded-full blur-sm animate-pulse opacity-50" />
                </div>
                <span className="text-white/90 font-medium">Empowering Rural Education</span>
                <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" />
              </div>
              
              <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-8 leading-none">
                Transform
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                  Rural Education
                </span>
              </h1>
              
              <p className="text-2xl text-white/70 mb-10 leading-relaxed font-light">
                VidhyaMitra empowers rural teachers with{' '}
                <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text font-semibold">
                  intelligent AI tools
                </span>
                {' '}to create assignments, generate question papers, and manage student data effortlessly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 mb-12">
                <button 
                  onClick={handleLogin}
                  className="group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-75" />
                  <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-10 py-5 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 font-bold text-xl flex items-center justify-center space-x-3">
                    <Zap className="w-6 h-6" />
                    <span>Get Started</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </button>
                
                <button className="group relative overflow-hidden bg-white/5 backdrop-blur-xl border-2 border-white/20 text-white px-10 py-5 rounded-2xl hover:bg-white/10 hover:border-white/30 transition-all duration-500 font-semibold text-xl">
                  <span>Learn More</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </button>
              </div>
              
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-3">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-3 border-black flex items-center justify-center text-white font-bold shadow-xl">
                        {i}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">1000+ Teachers</div>
                    <div className="text-white/60">Active Users</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                  <span className="text-white/80 ml-2 font-semibold text-lg">4.9/5</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative group">
                {/* Main Card */}
                <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl transform rotate-3 group-hover:rotate-6 transition-all duration-700">
                  <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 transform -rotate-6 border border-white/10">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className={`bg-gradient-to-r ${features[currentFeature].color} p-4 rounded-2xl shadow-lg`}>
                          {features[currentFeature].icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-xl">{features[currentFeature].title}</h3>
                          <p className="text-white/70">{features[currentFeature].description}</p>
                        </div>
                      </div>
                      
                      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-white/80 font-medium">Class Progress</span>
                          <span className="text-white font-bold text-xl">85%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                          <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 h-full rounded-full w-4/5 transition-all duration-2000 shadow-lg animate-pulse" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: 'Students', value: '156' },
                          { label: 'Assignments', value: '23' },
                          { label: 'Papers', value: '8' }
                        ].map((stat, index) => (
                          <div key={index} className="text-center bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10">
                            <div className="text-white font-bold text-2xl">{stat.value}</div>
                            <div className="text-white/60 text-sm">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-4 animate-bounce shadow-2xl">
                  <Star className="w-8 h-8 text-white" />
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-400 to-teal-500 rounded-full p-4 animate-pulse shadow-2xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 mb-8">
              <Sparkles className="w-5 h-5 text-purple-400 animate-spin" />
              <span className="text-white/80 font-medium">Powerful Features</span>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-6">
              Everything You Need for
              <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Modern Teaching
              </span>
            </h2>
            
            <p className="text-xl text-white/70 max-w-3xl mx-auto font-light">
              Cutting-edge tools designed specifically for rural educators to enhance learning outcomes and streamline classroom management.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group relative"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
                
                <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-2xl">
                  <div className={`bg-gradient-to-r ${feature.color} text-white p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 group-hover:bg-clip-text transition-all duration-500">
                    {feature.title}
                  </h3>
                  
                  <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-500">
                    {feature.description}
                  </p>
                  
                  <div className="mt-6 flex items-center space-x-2 text-white/50 group-hover:text-white/80 transition-colors duration-500">
                    <span className="text-sm font-medium">Learn more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="aboutus" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-20 items-center">
            <div className="mb-16 lg:mb-0">
              <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 mb-8">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-white/80 font-medium">Our Mission</span>
              </div>
              
              <h2 className="text-5xl lg:text-6xl font-black text-white mb-8">
                About
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"> VidhyaMitra</span>
              </h2>
              
              <div className="space-y-6 text-lg text-white/70 leading-relaxed">
                <p>
                  VidhyaMitra is a revolutionary teacher management system born from the vision of{' '}
                  <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-semibold">
                    democratizing quality education
                  </span>
                  {' '}across rural India.
                </p>
                
                <p>
                  We understand that rural educators face unique challenges - from limited internet connectivity 
                  to resource constraints. That's why we've engineered VidhyaMitra to be{' '}
                  <span className="text-transparent bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text font-semibold">
                    resilient, intuitive, and powerful
                  </span>
                  {' '}even in the most challenging environments.
                </p>
                
                <p>
                  Our AI-powered platform doesn't just manage classrooms - it{' '}
                  <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text font-semibold">
                    transforms the entire teaching experience
                  </span>
                  , bridging the digital divide and bringing world-class educational tools to every corner of the nation.
                </p>
              </div>
              
              <div className="mt-10 space-y-4">
                {[
                  "Offline-first design for reliable access",
                  "AI-powered content generation and analytics",
                  "Intuitive interface designed for all skill levels",
                  "Comprehensive teacher training and support"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 group">
                    <div className="relative">
                      <CheckCircle className="w-7 h-7 text-green-400 relative z-10" />
                      <div className="absolute inset-0 bg-green-400 rounded-full blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <span className="text-white/80 text-lg group-hover:text-white transition-colors duration-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-10 border border-white/20 shadow-2xl">
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { number: '1000+', label: 'Teachers', color: 'from-blue-400 to-cyan-400', icon: <Users className="w-6 h-6" /> },
                    { number: '50K+', label: 'Students', color: 'from-purple-400 to-pink-400', icon: <BookOpen className="w-6 h-6" /> },
                    { number: '200+', label: 'Schools', color: 'from-green-400 to-teal-400', icon: <Globe className="w-6 h-6" /> },
                    { number: '15+', label: 'States', color: 'from-orange-400 to-red-400', icon: <TrendingUp className="w-6 h-6" /> }
                  ].map((stat, index) => (
                    <div key={index} className="text-center group hover:scale-105 transition-all duration-500">
                      <div className={`bg-gradient-to-r ${stat.color} text-white p-4 rounded-2xl w-fit mx-auto mb-4 group-hover:shadow-2xl transition-all duration-500`}>
                        {stat.icon}
                      </div>
                      <div className={`text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                        {stat.number}
                      </div>
                      <div className="text-white/70 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Floating Achievement Badge */}
              <div className="absolute -top-8 -right-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-6 animate-pulse shadow-2xl">
                <div className="text-white text-center">
                  <Star className="w-8 h-8 mx-auto mb-1" />
                  <div className="text-xs font-bold">#1 Rural EdTech</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-12 border border-white/20 shadow-2xl">
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-6">
              Ready to{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Revolutionize
              </span>
              <br />Your Teaching?
            </h2>
            
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto font-light">
              Join the thousands of rural educators who are already transforming their classrooms with VidhyaMitra's intelligent platform.
            </p>
            
            <button 
              onClick={handleLogin}
              className="group relative overflow-hidden inline-block"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-75" />
              <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-12 py-6 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 font-bold text-xl flex items-center space-x-3">
                <Sparkles className="w-6 h-6 animate-spin" />
                <span>Start Your Journey</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-8 md:mb-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-75" />
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
              </div>
              <span className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                VidhyaMitra
              </span>
            </div>
            
            <div className="text-white/60 text-center md:text-right">
              <p className="text-lg font-medium">&copy; 2025 VidhyaMitra. All rights reserved.</p>
              <p className="mt-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                Empowering rural education, one teacher at a time.
              </p>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}