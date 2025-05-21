import React from 'react';
import { Link } from 'react-router-dom';
import { Feather, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center">
              <Feather className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-xl font-semibold text-white">FeatherShop</span>
            </Link>
            <p className="mt-4 text-sm text-gray-300">
              Empowering sellers to create beautiful online storefronts with ease.
              Feather-light, powerful e-commerce solutions for everyone.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-150">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-150">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-150">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-150">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Shop</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/shop" className="text-gray-400 hover:text-white text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop?category=clothing" className="text-gray-400 hover:text-white text-sm">
                  Clothing
                </Link>
              </li>
              <li>
                <Link to="/shop?category=electronics" className="text-gray-400 hover:text-white text-sm">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/shop?category=home" className="text-gray-400 hover:text-white text-sm">
                  Home
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Sellers</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white text-sm">
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-white text-sm">
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Seller Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white text-sm">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} FeatherShop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;