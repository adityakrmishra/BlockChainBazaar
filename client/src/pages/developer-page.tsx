import { Github, Linkedin, Mail, Globe, Video, Code, Database, Instagram } from "lucide-react";
import adityaImage from "@assets/Aditya.jpg";

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

export default function DeveloperPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Developer Image */}
          <div className="w-full md:w-1/3">
            <div className="rounded-xl overflow-hidden shadow-lg border dark:border-gray-800">
              <img 
                src={adityaImage} 
                alt="Aditya Kumar Mishra" 
                className="w-full h-auto object-cover aspect-square"
              />
              <div className="p-5 bg-white dark:bg-gray-900">
                <h2 className="text-2xl font-bold">Aditya Kr Mishra</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">School Student</p>
                
                <div className="mt-4 flex flex-wrap gap-3">
                  <a 
                    href="https://github.com/adityakrmishra" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-secondary hover:text-white transition-colors"
                    title="GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/aditya-kumarmishra" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-secondary hover:text-white transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a 
                    href="mailto:cjrcoder@gmail.com" 
                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-secondary hover:text-white transition-colors"
                    title="Email"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://adityakrmishra.github.io/protfolio/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-secondary hover:text-white transition-colors"
                    title="Portfolio"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://www.instagram.com/aditya_kr._mishra" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-secondary hover:text-white transition-colors"
                    title="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://unstop.com/u/aditymis95035" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-secondary hover:text-white transition-colors"
                    title="Unstop"
                  >
                    <UnstopIcon />
                  </a>
                  <a 
                    href="https://leetcode.com/u/adityakr_mishra/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-secondary hover:text-white transition-colors"
                    title="LeetCode"
                  >
                    <LeetCodeIcon />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Developer Info */}
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">About the Developer</h1>
            
            <p className="text-lg mb-6">
              A passionate developer with expertise in video editing, web development, and digital marketing. 
              Currently exploring machine learning and AI applications.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">Skills & Expertise</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start space-x-3 p-4 rounded-lg bg-accent dark:bg-gray-800">
                <Code className="w-6 h-6 text-secondary mt-1" />
                <div>
                  <h3 className="font-semibold">Web Development</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Proficient in React, Node.js, TypeScript, and modern frameworks for building responsive, 
                    scalable web applications
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 rounded-lg bg-accent dark:bg-gray-800">
                <Video className="w-6 h-6 text-secondary mt-1" />
                <div>
                  <h3 className="font-semibold">Video Editing</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Expert in Adobe Premiere Pro, After Effects, and other video editing 
                    tools for creating high-quality content
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 rounded-lg bg-accent dark:bg-gray-800">
                <Database className="w-6 h-6 text-secondary mt-1" />
                <div>
                  <h3 className="font-semibold">Machine Learning & AI</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Exploring advanced technologies including machine learning and AI applications
                    for developing intelligent solutions
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 rounded-lg bg-accent dark:bg-gray-800">
                <Globe className="w-6 h-6 text-secondary mt-1" />
                <div>
                  <h3 className="font-semibold">Digital Marketing</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Skilled in SEO, social media marketing, content creation, and analytics for
                    driving audience engagement and growth
                  </p>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">About This Project</h2>
            <p className="mb-4">
              This NFT marketplace represents a fusion of blockchain technology and digital art commerce. 
              Built with React and TypeScript on the frontend and Node.js on the backend, it offers a 
              seamless experience for users to explore, create, buy, and sell digital assets.
            </p>
            
            <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
              <h3 className="font-semibold text-secondary mb-2">Project Highlights</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
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