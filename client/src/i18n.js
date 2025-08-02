import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // App
      app: {
        name: 'Kisaan',
        description: 'Digital marketplace connecting farmers with buyers for fresh grains'
      },

      // Navigation  
      nav: {
        home: 'Home',
        grains: 'Grains',
        dashboard: 'Dashboard',
        profile: 'Profile',
        orders: 'Orders',
        listings: 'My Listings',
        admin: 'Admin Panel',
        settings: 'Settings',
        myListings: 'My Listings',
        addGrain: 'Add Grain',
        myOrders: 'My Orders',
        adminDashboard: 'Admin Dashboard',
        manageUsers: 'Manage Users',
        manageGrains: 'Manage Grains',
        analytics: 'Analytics'
      },
      
      // Common
      common: {
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        loading: 'Loading...',
        submit: 'Submit',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        view: 'View',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        yes: 'Yes',
        no: 'No',
        confirm: 'Confirm',
        price: 'Price',
        quantity: 'Quantity',
        location: 'Location',
        contact: 'Contact',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        name: 'Name',
        description: 'Description',
        status: 'Status',
        date: 'Date',
        time: 'Time',
        actions: 'Actions',
        comingSoon: 'Coming Soon',
        viewAll: 'View All',
        quintals: 'quintals',
        quintal: 'quintal'
      },
      
      // Authentication
      auth: {
        // Simple strings for navbar and buttons
        loginBtn: 'Login',
        registerBtn: 'Register', 
        logout: 'Logout',
        
        // Form-specific content
        login: {
          title: 'Sign in to your account',
          subtitle: 'Welcome back! Please enter your details.',
          forgotPassword: 'Forgot your password?',
          noAccount: "Don't have an account?",
          signUp: 'Sign up here',
          submit: 'Sign In'
        },
        register: {
          title: 'Create your account',
          subtitle: 'Join Kisaan to start trading grains',
          step1: 'Basic Information',
          step2: 'Contact & Address',
          next: 'Next Step',
          back: 'Previous Step',
          haveAccount: 'Already have an account?',
          signIn: 'Sign in here',
          submit: 'Create Account'
        },
        fields: {
          name: 'Full Name',
          email: 'Email Address',
          password: 'Password',
          confirmPassword: 'Confirm Password',
          role: 'Role',
          phone: 'Phone Number',
          address: 'Address',
          street: 'Street Address',
          city: 'City',
          state: 'State',
          pincode: 'PIN Code'
        },
        placeholders: {
          name: 'Enter your full name',
          email: 'Enter your email address',
          password: 'Enter your password',
          confirmPassword: 'Confirm your password',
          phone: 'Enter your phone number',
          street: 'Enter street address',
          city: 'Enter city',
          state: 'Enter state',
          pincode: 'Enter PIN code'
        },
        errors: {
          nameRequired: 'Name is required',
          nameMinLength: 'Name must be at least 2 characters',
          emailRequired: 'Email is required',
          emailInvalid: 'Please enter a valid email address',
          passwordRequired: 'Password is required',
          passwordMinLength: 'Password must be at least 6 characters',
          confirmPasswordRequired: 'Please confirm your password',
          passwordsNoMatch: 'Passwords do not match',
          roleRequired: 'Please select a role',
          phoneRequired: 'Phone number is required',
          phoneInvalid: 'Please enter a valid 10-digit phone number',
          streetRequired: 'Street address is required',
          cityRequired: 'City is required',
          stateRequired: 'State is required',
          pincodeRequired: 'PIN code is required',
          pincodeInvalid: 'Please enter a valid 6-digit PIN code',
          addressRequired: 'Address is required',
          registrationFailed: 'Registration failed. Please try again.',
          loginFailed: 'Login failed. Please check your credentials.'
        },
        password: {
          veryWeak: 'Very Weak',
          weak: 'Weak',
          fair: 'Fair',
          good: 'Good',
          strong: 'Strong'
        }
      },
      
      // Home page
      home: {
        hero: {
          title: 'Digital Marketplace for Fresh Grains',
          subtitle: 'Connect farmers directly with buyers for the freshest quality grains',
          cta: 'Start Trading',
          learnMore: 'Learn More',
          getStarted: 'Get Started',
          browseGrains: 'Browse Grains',
          goToDashboard: 'Go to Dashboard'
        },
        benefits: {
          title: 'Why Choose Kisaan?',
          subtitle: 'Our platform provides the best solutions for farmers and buyers',
          directConnection: 'Direct connection between farmers and buyers',
          transparentPricing: 'Transparent and fair pricing',
          qualityGuarantee: 'Quality assurance for all products',
          securePayments: 'Secure payment processing',
          logisticsSupport: 'Logistics and delivery support',
          multilingual: 'Multilingual platform support',
          joinCommunity: 'Join Our Community',
          communityDescription: 'Connect with thousands of farmers and buyers across India'
        },
        features: {
          title: 'Why Choose Kisaan?',
          subtitle: 'Our platform provides the best solutions for farmers and buyers',
          qualityAssurance: {
            title: 'Quality Assured',
            description: 'All grains are verified for quality and freshness'
          },
          fairPricing: {
            title: 'Fair Pricing',
            description: 'Transparent pricing with no hidden costs'
          },
          logistics: {
            title: 'Logistics Support',
            description: 'End-to-end delivery and logistics support'
          },
          community: {
            title: 'Community',
            description: 'Join thousands of farmers and buyers'
          }
        },
        testimonials: {
          title: 'What Our Users Say',
          subtitle: 'Real stories from farmers and buyers using Kisaan',
          farmer: 'Farmer',
          buyer: 'Buyer',
          farmer1: 'Kisaan has transformed my farming business. I can now sell directly to buyers and get fair prices for my grains.',
          buyer1: 'The quality of grains I get through Kisaan is excellent. Direct connection with farmers ensures freshness.',
          farmer2: 'The platform is easy to use and has helped me reach customers across the country. Highly recommended!'
        },
        cta: {
          title: 'Ready to Start Trading?',
          subtitle: 'Join thousands of farmers and buyers on Kisaan',
          joinNow: 'Join Now',
          signIn: 'Sign In',
          goToDashboard: 'Go to Dashboard'
        },
        stats: {
          farmers: 'Active Farmers',
          buyers: 'Happy Buyers',
          grains: 'Grain Varieties',
          orders: 'Orders Completed',
          quintals: 'Quintals Sold',
          cities: 'Cities Served'
        }
      },

      // Roles
      roles: {
        farmer: 'Farmer',
        buyer: 'Buyer'
      },
      
      // Dashboard
      dashboard: {
        welcome: 'Welcome back',
        stats: 'Statistics',
        recentActivity: 'Recent Activity',
        quickActions: 'Quick Actions',
        notifications: 'Notifications',
        invalidRole: 'Invalid user role. Please contact support.',
        contactSupport: 'Contact Support'
      },
      
      // Farmer specific
      farmer: {
        addListing: 'Add New Grain Listing',
        myListings: 'My Grain Listings',
        receivedOrders: 'Received Orders',
        earnings: 'Earnings',
        dashboard: {
          welcome: 'Welcome back, {{name}}!',
          subtitle: 'Manage your grain listings and track your orders',
          quickActions: 'Quick Actions',
          recentListings: 'Recent Listings',
          recentOrders: 'Recent Orders',
          noListings: 'No grain listings yet',
          addFirstGrain: 'Add Your First Grain',
          noOrders: 'No orders received yet',
          addGrain: 'Add New Grain',
          addGrainDesc: 'List a new grain for sale',
          viewListings: 'View Listings',
          viewListingsDesc: 'Manage your grain listings',
          viewOrders: 'View Orders',
          viewOrdersDesc: 'Check received orders',
          totalListings: 'Total Listings',
          activeListings: 'Active Listings',
          totalOrders: 'Total Orders',
          totalRevenue: 'Total Revenue'
        }
      },
      
      // Buyer specific
      buyer: {
        dashboard: {
          title: 'Buyer Dashboard',
          welcome: 'Welcome back, {{name}}!',
          subtitle: 'Browse and purchase grain from farmers',
          browseGrains: 'Browse All Grains',
          myOrders: 'My Orders',
          wishlist: 'Wishlist',
          noOrders: 'No orders placed yet',
          startShopping: 'Start Shopping'
        }
      },

      // Order Status
      orderStatus: {
        pending: 'Pending',
        confirmed: 'Confirmed',
        paid: 'Paid',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
      },
      
      // Admin specific
      admin: {
        dashboard: {
          title: 'Admin Dashboard',
          welcome: 'Admin Dashboard',
          subtitle: 'Manage users, listings, and system settings',
          userManagement: 'User Management',
          listingManagement: 'Listing Management',
          systemStats: 'System Statistics',
          reports: 'Reports'
        }
      },
      
      // Error pages
      errors: {
        '404': {
          title: 'Page Not Found',
          message: 'The page you are looking for does not exist.',
          goHome: 'Go to Home',
          goBack: 'Go Back'
        },
        '403': {
          title: 'Access Denied',
          message: 'You do not have permission to access this page.',
          goHome: 'Go to Home',
          goBack: 'Go Back',
          goDashboard: 'Go to Dashboard'
        },
        '500': {
          title: 'Server Error',
          message: 'Something went wrong on our end. Please try again later.',
          goHome: 'Go to Home',
          goBack: 'Go Back'
        }
      },

      // Coming Soon
      comingSoon: {
        title: 'Coming Soon',
        message: 'This feature is under development and will be available soon.',
        stayTuned: 'Stay tuned for updates!'
      },

      // Footer
      footer: {
        description: 'Connecting farmers directly with buyers for fresh, quality grains. Building a sustainable agricultural marketplace.',
        company: 'Company',
        aboutUs: 'About Us',
        howItWorks: 'How It Works',
        careers: 'Careers',
        blog: 'Blog',
        forFarmers: 'For Farmers',
        sellGrain: 'Sell Grain',
        farmerGuide: 'Farmer Guide',
        qualityStandards: 'Quality Standards',
        pricing: 'Pricing',
        forBuyers: 'For Buyers',
        browseGrains: 'Browse Grains',
        buyerGuide: 'Buyer Guide',
        bulkOrders: 'Bulk Orders',
        logistics: 'Logistics',
        support: 'Support',
        helpCenter: 'Help Center',
        contactUs: 'Contact Us',
        faq: 'FAQ',
        reportIssue: 'Report Issue',
        phone: '+91 98765 43210',
        email: 'support@kisaan.com',
        address: 'Address',
        addressText: '123 Agriculture Street, Mumbai, Maharashtra 400001, India',
        newsletter: 'Newsletter',
        newsletterDescription: 'Subscribe to get updates on new grains and market prices',
        emailPlaceholder: 'Enter your email',
        subscribe: 'Subscribe',
        privacyPolicy: 'Privacy Policy',
        termsOfService: 'Terms of Service',
        cookiePolicy: 'Cookie Policy',
        refundPolicy: 'Refund Policy'
      }
    }
  },
  hi: {
    translation: {
      // App
      app: {
        name: 'किसान',
        description: 'ताजे अनाज के लिए किसानों और खरीदारों को जोड़ने वाला डिजिटल मार्केटप्लेस'
      },

      // Navigation
      nav: {
        home: 'होम',
        grains: 'अनाज',
        dashboard: 'डैशबोर्ड'
      },
      
      // Common
      common: {
        search: 'खोजें',
        loading: 'लोड हो रहा है...',
        comingSoon: 'जल्द आ रहा है'
      },
      
      // Authentication
      auth: {
        loginBtn: 'लॉगिन',
        registerBtn: 'रजिस्टर',
        logout: 'लॉगआउट'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;
