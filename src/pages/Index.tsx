import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import PeriodsSection from '@/components/home/PeriodsSection';
import FeaturesSection from '@/components/home/FeaturesSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <PeriodsSection />
      <FeaturesSection />
    </Layout>
  );
};

export default Index;
