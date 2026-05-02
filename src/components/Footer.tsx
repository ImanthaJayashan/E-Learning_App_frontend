import React from 'react';
import "./Footer.css";

const Footer: React.FC = () => (
  <footer className="bg-gray-200 text-gray-700">
    <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* left section */}
      <div className="space-y-4">
        <img
          className="h-12 w-auto"
          src="/Gemini_Generated_Image_5rph3y5rph3y5rph.png"
          alt="Little Learners Hub logo"
        />
        <p className="text-sm">
          <strong>Little Learners Hub</strong> is a digital platform for Pre school child for E learning.
        </p>
        <p className="text-sm">UI / UX Design and Website Development located in Sri Lanka</p>
        <p className="text-xs">© 2025 Little Learners Hub All Rights Reserved.</p>
      </div>

      {/* middle section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Support</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span>📍</span>
              <div>
                <p>SLIIT Malabe Campus,</p>
                <p>New Kandy Road,</p>
                <p>Malabe.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>✉️</span>
              <a href="mailto:prescelearn@gmail.com" className="hover:underline">
                prescelearn@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span>📞</span>
              <a href="tel:+94752151681" className="hover:underline">
                +94 75 2151 681
              </a>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline">Service</a></li>
            <li><a href="#" className="hover:underline">Features</a></li>
            <li><a href="#" className="hover:underline">Our Team</a></li>
            <li><a href="#" className="hover:underline">Portfolio</a></li>
            <li><a href="#" className="hover:underline">Blog</a></li>
            <li><a href="#" className="hover:underline">Contact Us</a></li>
          </ul>
        </div>
      </div>

      {/* right section */}
      <div className="space-y-4 text-sm">
        <h3 className="font-semibold">Follow Us</h3>
        <p>Connect with parents & educators!</p>
        <div className="flex space-x-4 text-xl">
          <a href="#" title="Instagram">📷</a>
          <a href="#" title="Facebook">f</a>
          <a href="#" title="Twitter">𝕏</a>
          <a href="#" title="LinkedIn">🔗</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
