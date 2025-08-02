import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  RectangleStackIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedInIcon
} from '../common/SocialIcons';

const Footer = () => {
  const { t } = useTranslation();

  const footerLinks = {
    company: [
      { name: t('footer.aboutUs'), href: '/about' },
      { name: t('footer.howItWorks'), href: '/how-it-works' },
      { name: t('footer.careers'), href: '/careers' },
      { name: t('footer.blog'), href: '/blog' }
    ],
    farmers: [
      { name: t('footer.sellGrain'), href: '/farmer/add-grain' },
      { name: t('footer.farmerGuide'), href: '/farmer-guide' },
      { name: t('footer.qualityStandards'), href: '/quality-standards' },
      { name: t('footer.pricing'), href: '/pricing' }
    ],
    buyers: [
      { name: t('footer.browseGrains'), href: '/grains' },
      { name: t('footer.buyerGuide'), href: '/buyer-guide' },
      { name: t('footer.bulkOrders'), href: '/bulk-orders' },
      { name: t('footer.logistics'), href: '/logistics' }
    ],
    support: [
      { name: t('footer.helpCenter'), href: '/help' },
      { name: t('footer.contactUs'), href: '/contact' },
      { name: t('footer.faq'), href: '/faq' },
      { name: t('footer.reportIssue'), href: '/report' }
    ],
    legal: [
      { name: t('footer.privacyPolicy'), href: '/privacy' },
      { name: t('footer.termsOfService'), href: '/terms' },
      { name: t('footer.cookiePolicy'), href: '/cookies' },
      { name: t('footer.refundPolicy'), href: '/refunds' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: FacebookIcon, href: '#' },
    { name: 'Twitter', icon: TwitterIcon, href: '#' },
    { name: 'Instagram', icon: InstagramIcon, href: '#' },
    { name: 'LinkedIn', icon: LinkedInIcon, href: '#' }
  ];

  const contactInfo = [
    {
      icon: PhoneIcon,
      label: t('footer.phone'),
      value: '+91 98765 43210'
    },
    {
      icon: EnvelopeIcon,
      label: t('footer.email'),
      value: 'support@kisaan.com'
    },
    {
      icon: MapPinIcon,
      label: t('footer.address'),
      value: t('footer.addressText')
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <RectangleStackIcon className="h-6 w-6" />
              </div>
              <span className="ml-2 text-xl font-bold">{t('app.name')}</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              {t('footer.description')}
            </p>
            
            {/* Social links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">
              {t('footer.company')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Farmers links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">
              {t('footer.forFarmers')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.farmers.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Buyers links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">
              {t('footer.forBuyers')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.buyers.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">
              {t('footer.support')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact section */}
        <div className="border-t border-gray-800 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-4 md:col-span-3">
              {t('footer.getInTouch')}
            </h3>
            {contactInfo.map((contact, index) => (
              <div key={index} className="flex items-start">
                <contact.icon className="h-5 w-5 text-primary-400 mt-1 flex-shrink-0" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-200">{contact.label}</p>
                  <p className="text-sm text-gray-300">{contact.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="border-t border-gray-800 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-gray-200 mb-2">
                {t('footer.newsletter')}
              </h3>
              <p className="text-gray-300 text-sm">
                {t('footer.newsletterDescription')}
              </p>
            </div>
            <div className="flex">
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="flex-1 min-w-0 px-4 py-2 bg-gray-800 border border-gray-600 rounded-l-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-gray-400"
              />
              <button className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-r-md transition-colors duration-200">
                {t('footer.subscribe')}
              </button>
            </div>
          </div>
        </div>

        {/* Legal links */}
        <div className="border-t border-gray-800 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex flex-wrap space-x-6 mb-4 md:mb-0">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <p className="text-sm text-gray-400">
              {t('footer.copyright', { year: new Date().getFullYear() })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
