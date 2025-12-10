import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import LessonCard from "@/components/cards/LessonCard";
import lessonThumb from "@/assets/lesson-thumb.jpg";

const CategoriaPage = () => {
  const { periodo, categoria } = useParams();
  const periodoId = periodo || "1";
  const categoriaId = categoria?.toUpperCase() || "SOI";

  const soiLessons = [
    { id: "apg", title: "APG - Aprendizagem Baseada em Problemas", description: "Metodologia ativa para resolução de casos clínicos", price: 197, originalPrice: 297 },
    { id: "pp", title: "PP - Prática Profissional", description: "Desenvolvimento de habilidades profissionais essenciais", price: 147, originalPrice: 197 },
    { id: "n1", title: "N1 - Avaliação Primeira Unidade", description: "Revisão completa e questões comentadas da N1", price: 97, originalPrice: 147 },
    { id: "n2", title: "N2 - Avaliação Segunda Unidade", description: "Preparatório completo para a segunda avaliação", price: 97, originalPrice: 147 },
    { id: "mult", title: "MULT - Questões Multidisciplinares", description: "Banco de questões integrando todas as disciplinas", price: 127, originalPrice: 177 },
  ];

  const hamLessons = [
    { id: "hami", title: "HAM I - Habilidades Médicas I", description: "Introdução às habilidades clínicas básicas", price: 197, originalPrice: 297 },
    { id: "hamii", title: "HAM II - Habilidades Médicas II", description: "Aprofundamento em técnicas de exame físico", price: 197, originalPrice: 297 },
    { id: "hamiii", title: "HAM III - Habilidades Médicas III", description: "Procedimentos e técnicas avançadas", price: 227, originalPrice: 327 },
    { id: "osce", title: "OSCE - Exame Clínico Objetivo", description: "Preparatório completo para o OSCE", price: 297, originalPrice: 397 },
    { id: "aulas", title: "Aulas Práticas Complementares", description: "Material de apoio para aulas práticas", price: 127, originalPrice: 177 },
    { id: "pediatria", title: "Pediatria - Módulo Especial", description: "Conteúdo focado em atendimento pediátrico", price: 247, originalPrice: 347 },
    { id: "provas", title: "Provas Anteriores Comentadas", description: "Resolução detalhada de provas passadas", price: 97, originalPrice: 147 },
    { id: "questoes", title: "Banco de Questões HAM", description: "Mais de 500 questões comentadas", price: 147, originalPrice: 197 },
  ];

  const lessons = categoriaId === "SOI" ? soiLessons : hamLessons;
  const categoryTitle = categoriaId === "SOI" ? "Saúde do Indivíduo" : "Habilidades Médicas";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: `${periodoId}º Período`, href: `/periodo/${periodoId}` },
            { label: categoriaId }
          ]} 
        />

        {/* Header */}
        <div className="mb-12">
          <span className="health-badge mb-4">{categoriaId}</span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            {categoryTitle}
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            {categoriaId === "SOI" 
              ? "Conteúdos completos para dominar os fundamentos da Saúde do Indivíduo"
              : "Desenvolva suas habilidades práticas com nosso conteúdo especializado"
            }
          </p>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {lessons.map((lesson) => (
            <LessonCard 
              key={lesson.id}
              id={lesson.id}
              title={lesson.title}
              description={lesson.description}
              price={lesson.price}
              originalPrice={lesson.originalPrice}
              imageUrl={lessonThumb}
              duration={`${Math.floor(Math.random() * 15 + 5)}h`}
              rating={4.5 + Math.random() * 0.5}
              lessons={Math.floor(Math.random() * 20 + 10)}
            />
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-12 health-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Quer acesso a todo o conteúdo?
            </h3>
            <p className="text-sm text-muted-foreground">
              Economize até 60% com nosso pacote completo do período
            </p>
          </div>
          <button className="health-button-primary whitespace-nowrap">
            Ver Pacote Completo
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CategoriaPage;
