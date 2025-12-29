/**
 * Asset Paths Configuration
 * 
 * This file centralizes all asset paths for the 3i MedTech website.
 * All assets are stored locally to ensure the website works independently
 * of external dependencies.
 * 
 * Directory Structure:
 * - /assets/images/logos - Company logos and branding
 * - /assets/images/banners - Hero and page banners
 * - /assets/images/icons - UI icons and feature icons
 * - /assets/images/products - Product images for all medical equipment
 * - /assets/documents - PDF brochures and documentation
 * 
 * Usage in components:
 * import { ASSETS } from '@/constants/assets';
 * <img src={ASSETS.LOGOS.MAIN} alt="3i MedTech" />
 * 
 * Note for CMS Integration:
 * When integrating with CMS, these paths can be overridden with
 * dynamic URLs from the media library. The CMS should store uploaded
 * images and return their URLs to replace these static paths.
 */

export const ASSETS = {
    // Company Logos
    LOGOS: {
        MAIN: '/assets/images/logos/logo.png', // Main header logo
        FOOTER: '/assets/images/logos/logo-footer.png', // Footer logo (150x150)
        FAVICON: '/assets/images/logos/favicon.png', // Browser favicon (32x32)
    },

    // Page Banners and Hero Images
    BANNERS: {
        HOME_HERO: '/assets/images/banners/hero-banner.jpg', // Homepage hero background
        NEW_PRODUCT_BADGE: '/assets/images/banners/new-product-badge.png', // Anamaya product badge
        ABOUT: '/assets/images/banners/about-banner.jpg', // About page hero
        WHY_CHOOSE_US: '/assets/images/banners/why-choose-us-banner.jpg', // Why Choose Us page
        MISSION_VISION: '/assets/images/banners/mission-vision-banner.jpg', // Mission & Vision page

        // Homepage feature boxes
        IMAGING_EXPERTS: '/assets/images/banners/imaging-equipment-experts.jpg',
        TRUSTED_PARTNER: '/assets/images/banners/trusted-healthcare-partner.jpg',
        HEALTHCARE_ACCESS: '/assets/images/banners/enhancing-healthcare-access.jpg',
    },

    // Icons and Feature Graphics
    ICONS: {
        AFFORDABLE_EXCELLENCE: '/assets/images/icons/affordable-excellence.png',
        COMPREHENSIVE_SOLUTIONS: '/assets/images/icons/comprehensive-solutions.png',
        UNWAVERING_SUPPORT: '/assets/images/icons/unwavering-support.png',
        PHONE: '/assets/images/icons/phone-icon.png', // Header phone icon
        VISION: '/assets/images/icons/vision-icon.png', // Mission page vision icon
        MISSION: '/assets/images/icons/mission-icon.png', // Mission page mission icon
    },

    // Product Images - Radiography Systems
    PRODUCTS: {
        RADIOGRAPHY: {
            DREAM_CMT_DUAL: '/assets/images/products/dream-cmt-dual.jpg',
            DREAM_CMT_SINGLE: '/assets/images/products/dream-cmt-single.jpg',
            DREAM_FLOOR_MOUNTED: '/assets/images/products/dream-floor-mounted-dr.jpg',
            ADONIS_MOBILE_XRAY: '/assets/images/products/adonis-mobile-xray.jpg',
            ADONIS_HF_RADIOGRAPHIC: '/assets/images/products/adonis-hf-radiographic.jpg',
        },

        // Portable X-Ray Solutions
        PORTABLE: {
            MINI_90: '/assets/images/products/mini-90-portable-xray.jpg',
            ADONIS_HF_MOBILE_DR: '/assets/images/products/adonis-hf-mobile-dr.jpg',
        },

        // Mammography Systems
        MAMMOGRAPHY: {
            PINKVIEW_DR_PLUS: '/assets/images/products/pinkview-dr-plus.jpg',
            PINKVIEW_RT: '/assets/images/products/pinkview-rt.jpg',
        },

        // Flat Panel Detectors
        DETECTORS: {
            GLASS_FREE: '/assets/images/products/glass-free-detector.jpg',
            RETROFIT_MAMMOGRAPHY: '/assets/images/products/retrofit-mammography-panel.jpg',
        },

        // MRI Systems
        MRI: {
            GE_SIGNA_HDXT: '/assets/images/products/ge-signa-hdxt-mri.jpg',
            PHILIPS_ACHIEVA: '/assets/images/products/philips-achieva-mri.jpg',
        },

        // Imaging Accessories
        IMAGING_ACCESSORIES: {
            DMD_D_2000: '/assets/images/products/dmd-d-2000-xray-film-digitizer.jpg',
            IMAGE_DISPLAY_MONITORS: '/assets/images/products/image-display-monitors.jpg',
            CT_MR_MAMMOGRAPH_WORKSTATIONS: '/assets/images/products/ct-mr-mammograph-multi-modality-workstations.jpg',
            CD_DVD_PUBLISHERS: '/assets/images/products/cd-dvd-publishers.jpg',
            MEDE_DRIVE: '/assets/images/products/mede-drive-patient-data-storage.jpg',
        },
    },

    // Documents and Downloads
    DOCUMENTS: {
        PRODUCT_BROCHURE: '/assets/documents/3i-medtech-product-brochure.pdf', // All products brochure
    },

    // External Links (not downloaded, kept as references)
    EXTERNAL: {
        ANAMAYA_WEBSITE: 'https://anamaya.3imedtech.com/', // Anamaya MRI product site
        REFEX_GROUP: 'https://www.refex.group/', // Parent company website
    },
};

// Contact Information Constants
export const CONTACT = {
    EMAIL: 'info@3imedtech.com',
    PHONE: '+91 94440 26307',
    PHONE_DISPLAY: '+91 94440 26307',

    ADDRESSES: {
        REGISTERED: 'Second Floor, Refex Towers, Sterling Road Signal, 313, Valluvar Kottam High Road, Nungambakkam, Chennai – 600034, Tamil Nadu',
        CORPORATE: 'Refex Building, 67, Bazullah Road, Parthasarathy Puram, T Nagar, Chennai – 600017',
    },
};

// Social Media Links
export const SOCIAL_MEDIA = {
    LINKEDIN: 'https://www.linkedin.com/company/refex-group/',
    FACEBOOK: 'https://www.facebook.com/refexindustrieslimited/',
    TWITTER: 'https://x.com/GroupRefex',
    YOUTUBE: 'https://www.youtube.com/@refexgroup',
    INSTAGRAM: 'https://www.instagram.com/refexgroup/',
};
