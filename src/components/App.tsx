import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { About } from './About';
import { ServicesOverview } from './ServicesOverview';
import { HowItWorks } from './HowItWorks';
import { TrackingSystem } from './TrackingSystem';
import { CaregiverProfiles } from './CaregiverProfiles';
import { Pricing } from './Pricing';
import { Testimonials } from './Testimonials';
import { Blog } from './Blog';
import { Contact } from './Contact';
import { Footer } from './Footer';
import { ThemeProvider } from 'next-themes';
import ThemeToggle from './ThemeToggle';

export default function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <Navbar />
      <Hero />
      <About />
      <ServicesOverview />
      <HowItWorks />
      <TrackingSystem />
      <CaregiverProfiles />
      <Pricing />
      <Testimonials />
      <Blog />
      <Contact />
      <Footer />
    </div>
  );
}