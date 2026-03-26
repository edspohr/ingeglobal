import React, { Suspense, lazy } from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import LandingHero from '../components/landing/LandingHero';
import WhatsAppFAB from '../components/landing/WhatsAppFAB';

const LandingServicios = lazy(() => import('../components/landing/LandingServicios'));
const LandingNosotros = lazy(() => import('../components/landing/LandingNosotros'));
const LandingContacto = lazy(() => import('../components/landing/LandingContacto'));
const LandingFooter = lazy(() => import('../components/landing/LandingFooter'));

export default function LandingPage() {
  return (
    <div className="bg-brand-darker min-h-screen overflow-x-hidden">
      <LandingNavbar />
      <LandingHero />
      <Suspense fallback={<div className="h-24" />}>
        <LandingServicios />
      </Suspense>
      <Suspense fallback={<div className="h-24" />}>
        <LandingNosotros />
      </Suspense>
      <Suspense fallback={<div className="h-24" />}>
        <LandingContacto />
      </Suspense>
      <Suspense fallback={<div className="h-24" />}>
        <LandingFooter />
      </Suspense>
      <WhatsAppFAB />
    </div>
  );
}
