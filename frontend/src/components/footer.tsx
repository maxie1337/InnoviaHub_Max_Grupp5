
import type React from "react";
import "./footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer bg-gray-900 text-white py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        
        {/* Center - Copyright */}
        <div className="w-full md:w-auto text-center mb-4 md:mb-0 md:flex-1">
          <p>© {new Date().getFullYear()} Innovia Hub. All rights reserved.</p>
        </div>

        {/* Right - Contact Info (stacked, email first) */}
        <div className="flex flex-col text-center md:text-right">
          <p className="mb-2">
            <a href="mailto:info@innoviahub.com" className="hover:underline">
              Email: info@innoviahub.com
            </a>
          </p>
          <p>
            <a href="tel:+1234567890" className="hover:underline">
              Phone: +1 (234) 567-890
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;