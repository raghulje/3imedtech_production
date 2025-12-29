import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import ProtectedRoute from '../components/admin/ProtectedRoute';

const HomePage = lazy(() => import('../pages/home/page'));
const AboutPage = lazy(() => import('../pages/about/page'));
const MissionVisionPage = lazy(() => import('../pages/mission-vision/page'));
const WhyChooseUsPage = lazy(() => import('../pages/why-choose-us/page'));
const ContactPage = lazy(() => import('../pages/contact/page'));
const RadiographySystemsPage = lazy(() => import('../pages/radiography-systems/page'));
const PortableXRaySolutionsPage = lazy(() => import('../pages/portable-x-ray-solutions/page'));
const MammographySystemsPage = lazy(() => import('../pages/mammography-systems/page'));
const FlatPanelDetectorsPage = lazy(() => import('../pages/flat-panel-detectors/page'));
const RefurbishedMRISystemsPage = lazy(() => import('../pages/refurbished-mri-systems/page'));
const ImagingAccessoriesPage = lazy(() => import('../pages/imaging-accessories/page'));
const FPDCArmPage = lazy(() => import('../pages/fpd-c-arm/page'));
const SearchPage = lazy(() => import('../pages/search/page'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Admin Pages
const AdminLogin = lazy(() => import('../pages/admin/Login'));
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('../pages/admin/Dashboard'));
const AdminCategories = lazy(() => import('../pages/admin/Dashboard'));
const AdminMedia = lazy(() => import('../pages/admin/Dashboard'));
const AdminSettings = lazy(() => import('../pages/admin/Dashboard'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/about/',
    element: <AboutPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/mission-vision-and-values/',
    element: <MissionVisionPage />,
  },
  {
    path: '/mission-vision-and-values',
    element: <MissionVisionPage />,
  },
  {
    path: '/why-choose-us/',
    element: <WhyChooseUsPage />,
  },
  {
    path: '/why-choose-us',
    element: <WhyChooseUsPage />,
  },
  {
    path: '/contact/',
    element: <ContactPage />,
  },
  {
    path: '/contact',
    element: <ContactPage />,
  },
  {
    path: '/radiography-systems/',
    element: <RadiographySystemsPage />,
  },
  {
    path: '/radiography-systems',
    element: <RadiographySystemsPage />,
  },
  {
    path: '/portable-x-ray-solutions/',
    element: <PortableXRaySolutionsPage />,
  },
  {
    path: '/portable-x-ray-solutions',
    element: <PortableXRaySolutionsPage />,
  },
  {
    path: '/mammography-systems/',
    element: <MammographySystemsPage />,
  },
  {
    path: '/mammography-systems',
    element: <MammographySystemsPage />,
  },
  {
    path: '/flat-panel-detectors/',
    element: <FlatPanelDetectorsPage />,
  },
  {
    path: '/flat-panel-detectors',
    element: <FlatPanelDetectorsPage />,
  },
  {
    path: '/refurbished-mri-systems/',
    element: <RefurbishedMRISystemsPage />,
  },
  {
    path: '/refurbished-mri-systems',
    element: <RefurbishedMRISystemsPage />,
  },
  {
    path: '/imaging-accessories/',
    element: <ImagingAccessoriesPage />,
  },
  {
    path: '/imaging-accessories',
    element: <ImagingAccessoriesPage />,
  },
  {
    path: '/fpd-c-arm/',
    element: <FPDCArmPage />,
  },
  {
    path: '/fpd-c-arm',
    element: <FPDCArmPage />,
  },
  {
    path: '/search',
    element: <SearchPage />,
  },
  {
    path: '/search-2',
    element: <SearchPage />,
  },
  {
    path: '/search-3',
    element: <SearchPage />,
  },
  // Admin Routes
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin/dashboard',
    element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>,
  },
  {
    path: '/admin/products',
    element: <ProtectedRoute><AdminProducts /></ProtectedRoute>,
  },
  {
    path: '/admin/categories',
    element: <ProtectedRoute><AdminCategories /></ProtectedRoute>,
  },
  {
    path: '/admin/media',
    element: <ProtectedRoute><AdminMedia /></ProtectedRoute>,
  },
  {
    path: '/admin/settings',
    element: <ProtectedRoute><AdminSettings /></ProtectedRoute>,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
