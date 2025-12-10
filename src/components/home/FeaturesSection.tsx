import { Video, Download, Award, Clock, Shield, Headphones } from 'lucide-react';

const features = [
  {
    icon: Video,
    title: 'Vídeos em HD',
    description: 'Aulas gravadas em alta definição com qualidade de streaming profissional.',
  },
  {
    icon: Download,
    title: 'Material Completo',
    description: 'PDFs, slides e resumos para download e estudo offline.',
  },
  {
    icon: Award,
    title: 'Certificado',
    description: 'Receba certificado de conclusão para cada curso finalizado.',
  },
  {
    icon: Clock,
    title: 'Acesso Vitalício',
    description: 'Comprou uma vez, é seu para sempre. Sem mensalidades.',
  },
  {
    icon: Shield,
    title: 'Garantia de 7 Dias',
    description: 'Não gostou? Devolvemos seu dinheiro em até 7 dias.',
  },
  {
    icon: Headphones,
    title: 'Suporte Dedicado',
    description: 'Tire suas dúvidas diretamente com nossos professores.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Por que escolher a <span className="gradient-text">HealthMed</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Oferecemos a melhor experiência de aprendizado para estudantes de medicina.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="glass-card p-6 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
