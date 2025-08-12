import React from "react";
import { FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";

import { FaFacebookF } from "react-icons/fa";
import { FaPinterestP } from "react-icons/fa";

const FooterLink = ({ href, children }) => {
  return (
    <a
      href={href}
      className="text-peach-50 hover:text-peach-200 transition-colors duration-200"
    >
      {children}
    </a>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-800 opacity-90 text-white p-8 w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mt-4 hidden sm:block">
          <div className="w-36 h-36 mix-blend-screen">
            <svg
              width="100"
              height="100"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="rounded-full"
            >
              <circle
                cx="28"
                cy="28"
                r="26"
                stroke="url(#halfGradient)"
                strokeWidth="4"
                fill="transparent"
              />
              <defs>
                <linearGradient id="halfGradient" x1="0" y1="0" x2="56" y2="0">
                  <stop offset="50%" stopColor="red" />
                  <stop offset="50%" stopColor="gray" />
                </linearGradient>
              </defs>
              <text
                x="10"
                y="36"
                fill="red"
                fontSize="24"
                fontWeight="bold"
                fontFamily="Arial, sans-serif"
              >
                H
              </text>
              <text
                x="27"
                y="36"
                fill="#6B7280"
                fontSize="24"
                fontWeight="bold"
                fontFamily="Arial, sans-serif"
              >
                M
              </text>
            </svg>
          </div>
        </div>

        {/* Emergency Info */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <hr className="h-px w-full bg-peach-50" />
          <div className="flex flex-col gap-2">
            <h5 className="uppercase text-peach-50 tracking-wider text-sm">
              Emergency & Crisis Info
            </h5>
            <p>
              If you or someone you know is experiencing an emergency or crisis
              and needs immediate help, call 911 or go to the nearest emergency
              room.
            </p>
            <FooterLink>03220-62999</FooterLink>
            <FooterLink>03220-60051</FooterLink>
          </div>
          <hr className="h-px w-full bg-peach-50 sm:hidden" />
        </div>

        {/* Bottom Section */}
        <div>
          <hr className="h-px w-full bg-peach-50" />
          <div className="lg:flex lg:justify-between lg:gap-8">
            <ul className="mb-6 mt-4 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:justify-between">
              {[
                {
                  href: "mailto:support@healthymind.com",
                  label: "support@healthymind.com",
                },
                { href: "/terms", label: "Terms & Conditions" },
                { href: "/privacy", label: "Privacy Policy" },
                {
                  href: "/wa-my-health-my-data-notice",
                  label: "WA My Health Data Notice",
                },
                {
                  href: "/notice-non-discrimination",
                  label: "Notice of Non-Discrimination",
                },
              ].map((item, index) => (
                <li key={index}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
            <p className="text-lg font-serif lg:order-first lg:mt-4">
              © 2025 Healthy Mind In A Heathy Body Group Inc.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
