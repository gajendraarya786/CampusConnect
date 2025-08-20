import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Users, BookOpen, Calendar, MessageSquare, Star } from 'lucide-react';

const CollegeHomepage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const navigate = useNavigate();

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  // Navigation functions with scroll to top
  const navigateToLogin = () => {
    scrollToTop();
    navigate('/login');
  };

  const navigateToSignup = () => {
    scrollToTop();
    navigate('/signup');
  };

  // Hero carousel data
 const heroSlides = [
  {
    title: "Connect with Your Campus Community",
    subtitle:
      "Join thousands of students sharing experiences, forming study groups, and building lifelong friendships",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=600&fit=crop&auto=format",
    cta: "Join Now",
  },
  {
    title: "Discover Campus Events",
    subtitle:
      "Never miss out on lectures, parties, club meetings, and exciting campus activities",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=600&fit=crop&auto=format", // ✅ group of students walking outdoors on campus
    cta: "Explore Events",
  },
  {
    title: "Academic Excellence Together",
    subtitle:
      "Share notes, form study groups, and collaborate on projects with your peers",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop&auto=format", // ✅ students studying in library
    cta: "Study Together",
  },
  {
    title: "Campus Life at Its Best",
    subtitle:
      "Experience the vibrant campus atmosphere and make memories that will last a lifetime",
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=600&fit=crop&auto=format",
    cta: "Get Started",
  },
  {
    title: "Your Academic Journey",
    subtitle:
      "Access resources, connect with professors, and excel in your studies with peer support",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=600&fit=crop&auto=format",
    cta: "Learn More",
  },
];



  // Student testimonials
  const testimonials = [
    {
      name: "Sarah Johnson",
      year: "Junior, Computer Science",
      text: "This platform helped me find my study group and closest friends. I can't imagine college life without it!",
      rating: 5
    },
    {
      name: "Mike Chen",
      year: "Sophomore, Business",
      text: "From finding roommates to joining clubs, this app has been essential for my college experience.",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      year: "Senior, Psychology",
      text: "The event discovery feature helped me get involved in campus activities I never would have found otherwise.",
      rating: 5
    }
  ];

  // Campus features
  const features = [
    {
      icon: Users,
      title: "Student Networks",
      description: "Connect with classmates, join study groups, and build your campus network"
    },
    {
      icon: Calendar,
      title: "Event Hub",
      description: "Discover campus events, parties, lectures, and club meetings in real-time"
    },
    {
      icon: BookOpen,
      title: "Study Collaboration",
      description: "Share notes, create study sessions, and ace your classes together"
    },
    {
      icon: MessageSquare,
      title: "Campus Chat",
      description: "Join conversations about courses, campus life, and everything in between"
    }
  ];

  // Auto-advance hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Floating Header with CTA - Mobile Only */}
      <div className="md:hidden sm: hidden fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/20">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Users className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CampusConnect
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={navigateToLogin} className="text-gray-600 hover:text-gray-900 font-medium text-xs transition-colors">
              Login
            </button>
            <button onClick={navigateToSignup} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-xs">
              Create Account
            </button>
          </div>
        </div>
      </div>

      {/* Hero Carousel */}
      <section className="relative h-60 sm:h-72 md:h-80 lg:h-96 xl:h-[450px] overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroSlides.map((slide, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ 
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${slide.image})`
                }}
              >
                <div className="flex items-center justify-center h-full px-2 sm:px-4 md:px-6 pt-16">
                  <div className="text-center text-white max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-5 md:mb-6 opacity-90 px-2">
                      {slide.subtitle}
                    </p>
                    <button onClick={navigateToSignup} className="bg-white text-gray-900 px-4 sm:px-6 md:px-7 py-2 sm:py-2.5 md:py-3 rounded-full text-sm sm:text-base md:text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg">
                      {slide.cta}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Carousel Controls */}
        <button 
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full backdrop-blur-sm transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full backdrop-blur-sm transition-all duration-200"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                currentSlide === index ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>



      {/* Features Section */}
      <section className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
              Everything You Need for College Life
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Connect, collaborate, and thrive in your academic journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={index} 
                  className="text-center p-3 sm:p-4 md:p-5 rounded-xl bg-white shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 border border-gray-100"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 rounded-xl mb-3 sm:mb-4">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section - Mid Page */}
      <section className="py-8 sm:py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
            Join Your Campus Community Today
          </h2>
          <p className="text-sm sm:text-base md:text-lg mb-6 opacity-90">
            Connect with thousands of students, discover events, and make the most of your college experience
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
            <button onClick={navigateToSignup} className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 w-full sm:w-auto text-sm">
              Create Free Account
            </button>
            <button className="border-2 border-white/30 text-white px-6 py-3 rounded-full font-semibold hover:bg-white/10 transition-all duration-200 w-full sm:w-auto text-sm">
              Take a Tour
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-8 sm:py-12 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              How CampusConnect Works
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Get started in just a few simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Create Your Profile</h3>
              <p className="text-sm text-gray-600">Sign up with your university email and set up your student profile</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Discover & Connect</h3>
              <p className="text-sm text-gray-600">Find classmates, join clubs, and discover campus events</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Thrive Together</h3>
              <p className="text-sm text-gray-600">Collaborate on projects, study together, and build lasting friendships</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-8 sm:py-12 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              What Students Say
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Real experiences from your peers
            </p>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 text-center border border-gray-100">
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-sm sm:text-base md:text-lg text-gray-700 mb-4 sm:mb-6 italic leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              <div>
                <div className="font-semibold text-sm sm:text-base text-gray-900">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  {testimonials[currentTestimonial].year}
                </div>
              </div>
            </div>
            
            {/* Testimonial Indicators */}
            <div className="flex justify-center mt-4 space-x-1 sm:space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                    currentTestimonial === index ? 'bg-blue-600 scale-125' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-8 sm:py-12 px-3 sm:px-4 md:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
            Join your university community and start connecting today. It's free and takes less than 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-sm mx-auto">
            <button onClick={navigateToSignup} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 w-full sm:w-auto text-sm">
              Sign Up Now
            </button>
            <button className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors">
              Learn More →
            </button>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-50 group"
        aria-label="Scroll to top"
      >
        <ChevronRight className="w-5 h-5 transform -rotate-90 group-hover:-translate-y-0.5 transition-transform" />
      </button>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-3 col-span-1 sm:col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold">CampusConnect</span>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm">
                Connecting students across universities nationwide.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Platform</h4>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Universities</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety</a></li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Support</h4>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Report Issue</a></li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Company</h4>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400 text-sm">
            <p>&copy; 2025 CampusConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CollegeHomepage;