// File: src/components/layout/Footer.jsx
const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            © 2024 Coffee Disease Analysis. All rights reserved.
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>v1.2.0</span>
            <span>•</span>
            <span>API Status: 
              <span className="ml-1 inline-block w-2 h-2 bg-green-400 rounded-full"></span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;