import { periods } from '@/data/courses';
import PeriodCard from '@/components/cards/PeriodCard';

const PeriodsSection = () => {
  return (
    <section id="periodos" className="py-20 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Escolha seu <span className="gradient-text">Período</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Navegue pelas aulas organizadas por período. Encontre o conteúdo ideal 
            para sua etapa na faculdade de medicina.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {periods.map((period, index) => (
            <PeriodCard key={period.id} period={period} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PeriodsSection;
