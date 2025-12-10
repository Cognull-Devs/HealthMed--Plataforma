import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import CategoryCard from "@/components/cards/CategoryCard";

const PeriodoPage = () => {
  const { id } = useParams();
  const periodoId = id || "1";

  const categories = [
    {
      category: "SOI",
      title: "Saúde do Indivíduo",
      description: "Conteúdos focados na saúde individual, incluindo APG, PP, N1, N2 e questões multidisciplinares",
      lessonCount: 5,
      icon: "stethoscope" as const,
    },
    {
      category: "HAM",
      title: "Habilidades Médicas",
      description: "Desenvolvimento de habilidades práticas essenciais para a prática médica",
      lessonCount: 8,
      icon: "brain" as const,
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: `${periodoId}º Período` }
          ]} 
        />

        {/* Header */}
        <div className="text-center mb-12">
          <span className="health-badge mb-4">Conteúdos do período</span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            {periodoId}º <span className="text-secondary">Período</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Selecione a categoria desejada para acessar os conteúdos disponíveis
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {categories.map((category) => (
            <CategoryCard 
              key={category.category} 
              periodoId={periodoId}
              {...category} 
            />
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 health-card p-8 max-w-4xl mx-auto">
          <h3 className="font-heading font-semibold text-xl text-foreground mb-4">
            Sobre o {periodoId}º Período
          </h3>
          <p className="text-muted-foreground mb-6">
            O {periodoId}º período abrange conteúdos fundamentais para sua formação médica. 
            Nossas aulas são elaboradas por professores experientes e seguem as 
            diretrizes mais atuais do ensino médico brasileiro.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Aulas", value: "45+" },
              { label: "Horas", value: "120h" },
              { label: "Questões", value: "500+" },
              { label: "Materiais", value: "50+" },
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 rounded-lg bg-muted/50">
                <span className="text-2xl font-bold text-primary">{stat.value}</span>
                <span className="block text-sm text-muted-foreground mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PeriodoPage;
