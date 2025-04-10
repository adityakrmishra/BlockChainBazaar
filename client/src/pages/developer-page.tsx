import { Github, Linkedin, Mail, Globe, Video, Code, Database, Instagram, Download } from "lucide-react";
import { useEffect } from "react";
import adityaImage from "@assets/Aditya.jpg";
import { Button } from "@/components/ui/button";

// Custom Unstop icon
const UnstopIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 12l10 10 10-10-10-10z"></path>
    <path d="M12 16a4 4 0 100-8 4 4 0 000 8z"></path>
  </svg>
);

// Custom LeetCode icon
const LeetCodeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
    <path d="M15 5l3 3"></path>
  </svg>
);

// Add CSS for animations
const animatedSkillStyle = "transform transition-all duration-500 hover:scale-105 hover:shadow-xl hover:z-10";

export default function DeveloperPage() {
  // Initialize animations on component mount
  useEffect(() => {
    // Add animation to the skills cards after page load
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
      setTimeout(() => {
        (card as HTMLElement).style.opacity = '1';
        (card as HTMLElement).style.transform = 'translateY(0)';
      }, 200 * (index + 1));
    });

    // Add typing animation to the developer name
    const nameElement = document.getElementById('dev-name');
    if (nameElement) {
      nameElement.classList.add('typing-animation');
    }
  }, []);

  // Add personal details from image
  const personalDetails = [
    { label: "Age", value: "15 Years" },
    { label: "Class", value: "11th" },
    { label: "School", value: "I.G.S.S. College" },
    { label: "Address", value: "Gopalganj, Bihar" }
  ];

  return (
    <div className="min-h-screen relative" style={{
      background: 'linear-gradient(to bottom, #000000, #0a0a0a)',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed'
    }}>
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="twinkling"></div>
      </div>
      
      <div className="container relative mx-auto py-16 px-4 md:px-6 z-10">
        {/* Gradient text heading */}
        <h1 
          id="dev-name"
          className="text-center text-4xl md:text-6xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-white to-pink-400"
        >
          Aditya Kumar Mishra
        </h1>
        
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            {/* Circular profile image with glow effect */}
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-cyan-400 blur-sm animate-pulse"></div>
              <img 
                src={adityaImage} 
                alt="Aditya Kumar Mishra" 
                className="relative w-40 h-40 md:w-56 md:h-56 object-cover rounded-full border-4 border-cyan-400 z-10"
              />
            </div>
            
            {/* Personal details */}
            <div className="text-center text-white mb-6">
              {personalDetails.map((detail, index) => (
                <p key={index} className="mb-1">
                  <span className="font-semibold">{detail.label}:</span> {detail.value}
                </p>
              ))}
            </div>
            
            {/* Download resume button */}
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-full px-6 py-2 flex items-center gap-2 transition-all duration-300 transform hover:scale-105 mb-8">
              <Download className="w-4 h-4" />
              Download Resume
            </Button>
            
            {/* Social media icons */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <a 
                href="https://github.com/adityakrmishra" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-gray-800 rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                title="GitHub"
              >
                <Github className="w-6 h-6" />
              </a>
              <a 
                href="https://www.linkedin.com/in/aditya-kumarmishra" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-gray-800 rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                title="LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a 
                href="mailto:cjrcoder@gmail.com" 
                className="p-3 bg-gray-800 rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                title="Email"
              >
                <Mail className="w-6 h-6" />
              </a>
              <a 
                href="https://adityakrmishra.github.io/protfolio/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-gray-800 rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                title="Portfolio"
              >
                <Globe className="w-6 h-6" />
              </a>
              <a 
                href="https://www.instagram.com/aditya_kr._mishra" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-gray-800 rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                title="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a 
                href="https://unstop.com/u/aditymis95035" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-gray-800 rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                title="Unstop"
              >
                <UnstopIcon />
              </a>
              <a 
                href="https://leetcode.com/u/adityakr_mishra/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-gray-800 rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                title="LeetCode"
              >
                <LeetCodeIcon />
              </a>
            </div>
          </div>
          
          {/* Skills & Expertise section with animations */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-10 text-white relative">
              <span className="bg-gradient-to-r from-cyan-400 to-green-300 bg-clip-text text-transparent">
                Skills & Expertise
              </span>
              <div className="absolute h-1 w-20 bg-gradient-to-r from-cyan-400 to-green-300 bottom-0 left-1/2 transform -translate-x-1/2 mt-2"></div>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`skill-card ${animatedSkillStyle} opacity-0 transform translate-y-8 p-5 rounded-xl border-2 border-cyan-400 bg-black bg-opacity-50 backdrop-blur-sm`}>
                <div className="flex items-start">
                  <div className="p-3 mr-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400">
                    <Code className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white mb-2">Web Development</h3>
                    <p className="text-gray-300">
                      Proficient in React, Node.js, TypeScript, and modern frameworks for building responsive, 
                      scalable web applications.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className={`skill-card ${animatedSkillStyle} opacity-0 transform translate-y-8 p-5 rounded-xl border-2 border-purple-400 bg-black bg-opacity-50 backdrop-blur-sm`}>
                <div className="flex items-start">
                  <div className="p-3 mr-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-400">
                    <Video className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white mb-2">Video Editing</h3>
                    <p className="text-gray-300">
                      Expert in Adobe Premiere Pro, After Effects, and other video editing 
                      tools for creating high-quality content.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className={`skill-card ${animatedSkillStyle} opacity-0 transform translate-y-8 p-5 rounded-xl border-2 border-green-400 bg-black bg-opacity-50 backdrop-blur-sm`}>
                <div className="flex items-start">
                  <div className="p-3 mr-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-400">
                    <Database className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white mb-2">Machine Learning & AI</h3>
                    <p className="text-gray-300">
                      Exploring advanced technologies including machine learning and AI applications
                      for developing intelligent solutions.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className={`skill-card ${animatedSkillStyle} opacity-0 transform translate-y-8 p-5 rounded-xl border-2 border-yellow-400 bg-black bg-opacity-50 backdrop-blur-sm`}>
                <div className="flex items-start">
                  <div className="p-3 mr-4 rounded-full bg-gradient-to-br from-yellow-500 to-orange-400">
                    <Globe className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white mb-2">Digital Marketing</h3>
                    <p className="text-gray-300">
                      Skilled in SEO, social media marketing, content creation, and analytics for
                      driving audience engagement and growth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* About Project Section */}
          <div className="p-6 rounded-xl border-2 border-gradient-to-r border-from-blue-500 border-to-purple-500 bg-black bg-opacity-70 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 text-white">About This Project</h2>
            <p className="mb-4 text-gray-300">
              This NFT marketplace represents a fusion of blockchain technology and digital art commerce. 
              Built with React and TypeScript on the frontend and Node.js on the backend, it offers a 
              seamless experience for users to explore, create, buy, and sell digital assets.
            </p>
            
            <div className="p-5 rounded-lg bg-gradient-to-r from-blue-900/40 to-purple-900/40 backdrop-blur-sm">
              <h3 className="font-semibold text-cyan-400 mb-3">Project Highlights</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-200">
                <li>User authentication with secure wallet integration</li>
                <li>NFT creation, listing, and auction capabilities</li>
                <li>Real-time bidding and transaction processing</li>
                <li>Responsive design for optimal viewing on all devices</li>
                <li>Dark mode support for enhanced user experience</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}