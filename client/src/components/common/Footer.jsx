import React from 'react';
import { Compass, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy-900 border-t border-navy-800 text-slate-400 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-sm">
              <Compass className="w-5 h-5 text-blue-500" />
              <span>Campus Lost & Found</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              The official centralized recovery portal connecting students,
              faculty, and campus security to recover lost belongings securely.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a href="/browse" className="hover:text-white transition">
                  Browse All Items
                </a>
              </li>
              <li>
                <a href="/report" className="hover:text-white transition">
                  Report a Lost Item
                </a>
              </li>
              <li>
                <a href="/report" className="hover:text-white transition">
                  Report a Found Item
                </a>
              </li>
              <li>
                <a href="/browse?type=Lost" className="hover:text-white transition">
                  Currently Lost Items
                </a>
              </li>
            </ul>
          </div>

          {/* Security & Verification */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
              Campus Security
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center space-x-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Verified Handover Protocols</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Physical items are deposited and claimed at the Main Security Office, Administration Block (Ground Floor).
              </p>
            </div>
          </div>

          {/* Emergency & Support */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
              Helpdesk & Support
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>Security Desk, Admin Block</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>lostfound@university.edu</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>Internal Ext: 4421 / 4422</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>© 2026 Campus Lost & Found Portal. Academic Project Submission.</p>
          <p className="mt-2 md:mt-0">Built with MongoDB, Express.js, React.js, and Node.js.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

