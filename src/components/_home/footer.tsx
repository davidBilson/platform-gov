import React from 'react';
import { Mail, Phone, Linkedin, Twitter, Github } from 'lucide-react';
import Logo from '../ui/logo';

const Footer = () => {
    return (
        <footer className="relative bg-white border-t border-gray-200">
            <div className="max-width mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-1 space-y-4">
                        <div>
                            <Logo />
                            <p className="text-sm leading-relaxed text-gray-600 mt-3">
                                Connecting elite consultants with ambitious projects worldwide.
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            {[
                                { icon: Linkedin, href: "#" },
                                { icon: Twitter, href: "#" },
                                { icon: Github, href: "#" }
                            ].map(({ icon: Icon, href }, index) => (
                                <a
                                    key={index}
                                    href={href}
                                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-300 hover:bg-boldblue hover:text-white"
                                >
                                    <Icon className="w-4 h-4 text-gray-600 hover:text-white" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                            Quick Links
                        </h4>
                        <nav className="space-y-2">
                            {['Find Consultants', 'Browse Jobs', 'How It Works', 'Contact Us'].map((link) => (
                                <a
                                    key={link}
                                    href="#"
                                    className="block text-sm text-gray-600 hover:text-boldblue transition-colors duration-200"
                                >
                                    {link}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                            Contact
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <a
                                    href="mailto:admin@govlinkglobal.com"
                                    className="text-sm text-gray-600 hover:text-boldblue hover:underline"
                                >
                                    admin@govlinkglobal.com
                                </a>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-500">
                            © 2025 GovLink Global. All rights reserved.
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <a href="#" className="hover:text-gray-700">Privacy Policy</a>
                            <a href="#" className="hover:text-gray-700">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;