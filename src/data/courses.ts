export interface Period {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  coursesCount: number;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  duration: string;
  periodId: string;
  subject: string;
  thumbnailUrl: string;
  rating?: number;
  studentsCount?: number;
  includes: string[];
  muxPlaybackId?: string;
}

export const periods: Period[] = [
  {
    id: "1",
    name: "1º Período",
    slug: "1-periodo",
    description: "Fundamentos da medicina e introdução às ciências básicas",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    coursesCount: 12,
  },
  {
    id: "2",
    name: "2º Período",
    slug: "2-periodo",
    description: "Aprofundamento em anatomia e fisiologia humana",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
    coursesCount: 15,
  },
  {
    id: "3",
    name: "3º Período",
    slug: "3-periodo",
    description: "Patologia geral e processos patológicos",
    imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop",
    coursesCount: 10,
  },
  {
    id: "4",
    name: "4º Período",
    slug: "4-periodo",
    description: "Farmacologia e terapêutica medicamentosa",
    imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop",
    coursesCount: 14,
  },
  {
    id: "5",
    name: "5º Período",
    slug: "5-periodo",
    description: "Semiologia médica e propedêutica",
    imageUrl: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=300&fit=crop",
    coursesCount: 11,
  },
  {
    id: "6",
    name: "6º Período",
    slug: "6-periodo",
    description: "Clínica médica e especialidades",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop",
    coursesCount: 16,
  },
];

export const courses: Course[] = [
  // 1º Período
  {
    id: "c1",
    title: "Anatomia Humana Básica",
    slug: "anatomia-humana-basica",
    shortDescription: "Fundamentos completos de anatomia para o primeiro período",
    longDescription: "Este curso abrangente de Anatomia Humana Básica foi desenvolvido especialmente para estudantes do primeiro período de medicina. Você aprenderá sobre todos os sistemas do corpo humano, desde a estrutura óssea até os órgãos vitais, com ilustrações detalhadas e casos práticos.",
    price: 89.90,
    originalPrice: 149.90,
    duration: "8 horas",
    periodId: "1",
    subject: "Anatomia",
    thumbnailUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=300&fit=crop",
    rating: 4.9,
    studentsCount: 1250,
    includes: [
      "8 horas de vídeo em alta definição",
      "Material em PDF para download",
      "Atlas anatômico digital",
      "Exercícios práticos",
      "Certificado de conclusão",
      "Acesso vitalício",
    ],
  },
  {
    id: "c2",
    title: "Bioquímica Médica",
    slug: "bioquimica-medica",
    shortDescription: "Bases bioquímicas essenciais para a prática médica",
    longDescription: "Domine os conceitos fundamentais de bioquímica aplicados à medicina. Este curso cobre metabolismo, enzimologia, e biologia molecular com foco na aplicação clínica.",
    price: 79.90,
    duration: "6 horas",
    periodId: "1",
    subject: "Bioquímica",
    thumbnailUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop",
    rating: 4.8,
    studentsCount: 980,
    includes: [
      "6 horas de videoaulas",
      "Resumos em PDF",
      "Mapas mentais",
      "Questões comentadas",
      "Certificado de conclusão",
    ],
  },
  {
    id: "c3",
    title: "Histologia - Tecidos Fundamentais",
    slug: "histologia-tecidos",
    shortDescription: "Estudo microscópico dos tecidos do corpo humano",
    longDescription: "Aprenda a identificar e compreender os quatro tecidos fundamentais: epitelial, conjuntivo, muscular e nervoso. Inclui imagens de alta resolução de lâminas histológicas.",
    price: 69.90,
    duration: "5 horas",
    periodId: "1",
    subject: "Histologia",
    thumbnailUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=300&fit=crop",
    rating: 4.7,
    studentsCount: 756,
    includes: [
      "5 horas de conteúdo",
      "Atlas histológico digital",
      "Quiz interativo",
      "Material complementar",
    ],
  },
  // 2º Período
  {
    id: "c4",
    title: "Prova Final - SOI II",
    slug: "prova-final-soi2",
    shortDescription: "Revisão completa para a prova final de SOI II",
    longDescription: "Prepare-se de forma intensiva para a prova final de Saúde, Organismo e Integração II. Este curso inclui revisão de todos os tópicos, questões comentadas e simulados.",
    price: 150.90,
    originalPrice: 199.90,
    duration: "6 horas",
    periodId: "2",
    subject: "SOI",
    thumbnailUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
    rating: 5.0,
    studentsCount: 2100,
    includes: [
      "6 horas de revisão intensiva",
      "Simulados completos",
      "Questões de provas anteriores",
      "Resumos estratégicos",
      "Dicas de prova",
      "Suporte do professor",
    ],
  },
  {
    id: "c5",
    title: "Integradora - MCM 2",
    slug: "integradora-mcm2",
    shortDescription: "Módulo integrador de Mecanismos Celulares e Moleculares",
    longDescription: "Domine os conceitos integradores de MCM 2 com este curso completo que conecta todos os tópicos do período.",
    price: 39.90,
    duration: "3 horas",
    periodId: "2",
    subject: "MCM",
    thumbnailUrl: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&h=300&fit=crop",
    rating: 4.8,
    studentsCount: 890,
    includes: [
      "3 horas de aulas",
      "Mapas conceituais",
      "Exercícios integrativos",
      "Material de estudo",
    ],
  },
  {
    id: "c6",
    title: "Revisão TPI - Teste de Progresso",
    slug: "revisao-tpi",
    shortDescription: "Preparação completa para o Teste de Progresso Institucional",
    longDescription: "Revisão estratégica para o TPI cobrindo todos os períodos com questões modelo e técnicas de resolução.",
    price: 22.99,
    duration: "4 horas",
    periodId: "2",
    subject: "TPI",
    thumbnailUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop",
    rating: 4.9,
    studentsCount: 1560,
    includes: [
      "4 horas de revisão",
      "Banco de questões",
      "Estratégias de prova",
      "Simulado TPI",
    ],
  },
  {
    id: "c7",
    title: "SOI II - Programada 01",
    slug: "soi2-programada01",
    shortDescription: "Primeira aula programada de SOI II com conteúdo completo",
    longDescription: "Acompanhe o conteúdo da primeira programada de SOI II com explicações detalhadas e exercícios práticos.",
    price: 30.00,
    duration: "3 horas",
    periodId: "2",
    subject: "SOI",
    thumbnailUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
    rating: 4.7,
    studentsCount: 650,
    includes: [
      "3 horas de aula",
      "Material da programada",
      "Exercícios resolvidos",
    ],
  },
  // 3º Período
  {
    id: "c8",
    title: "Patologia Geral Completa",
    slug: "patologia-geral",
    shortDescription: "Todos os processos patológicos fundamentais",
    longDescription: "Estude patologia geral de forma completa: lesão celular, inflamação, reparo tecidual, distúrbios hemodinâmicos e neoplasias.",
    price: 129.90,
    originalPrice: 179.90,
    duration: "10 horas",
    periodId: "3",
    subject: "Patologia",
    thumbnailUrl: "https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=400&h=300&fit=crop",
    rating: 4.9,
    studentsCount: 1890,
    includes: [
      "10 horas de videoaulas",
      "Atlas de patologia",
      "Casos clínicos",
      "Questões comentadas",
      "Certificado",
    ],
  },
  {
    id: "c9",
    title: "Microbiologia Médica",
    slug: "microbiologia-medica",
    shortDescription: "Bactérias, vírus e fungos de importância médica",
    longDescription: "Aprenda sobre os principais microrganismos causadores de doenças, mecanismos de patogenicidade e bases do tratamento.",
    price: 99.90,
    duration: "8 horas",
    periodId: "3",
    subject: "Microbiologia",
    thumbnailUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=300&fit=crop",
    rating: 4.8,
    studentsCount: 1120,
    includes: [
      "8 horas de conteúdo",
      "Tabelas de microrganismos",
      "Casos clínicos",
      "Material complementar",
    ],
  },
  // 4º Período
  {
    id: "c10",
    title: "Farmacologia Básica",
    slug: "farmacologia-basica",
    shortDescription: "Princípios fundamentais da farmacologia médica",
    longDescription: "Domine farmacocinética, farmacodinâmica e as principais classes de medicamentos utilizados na prática clínica.",
    price: 119.90,
    duration: "9 horas",
    periodId: "4",
    subject: "Farmacologia",
    thumbnailUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop",
    rating: 4.9,
    studentsCount: 1650,
    includes: [
      "9 horas de aulas",
      "Tabelas de medicamentos",
      "Casos de prescrição",
      "Flashcards",
      "Certificado",
    ],
  },
  {
    id: "c11",
    title: "Parasitologia Médica",
    slug: "parasitologia-medica",
    shortDescription: "Parasitos de importância médica no Brasil",
    longDescription: "Estudo completo dos principais parasitos que afetam a população brasileira, ciclos de vida e diagnóstico.",
    price: 79.90,
    duration: "6 horas",
    periodId: "4",
    subject: "Parasitologia",
    thumbnailUrl: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=400&h=300&fit=crop",
    rating: 4.7,
    studentsCount: 890,
    includes: [
      "6 horas de videoaulas",
      "Atlas parasitológico",
      "Casos clínicos",
      "Questões de residência",
    ],
  },
  // 5º Período
  {
    id: "c12",
    title: "Semiologia Médica Completa",
    slug: "semiologia-completa",
    shortDescription: "Arte do exame clínico e raciocínio diagnóstico",
    longDescription: "Aprenda a realizar anamnese, exame físico completo e desenvolver raciocínio clínico com casos reais.",
    price: 159.90,
    originalPrice: 219.90,
    duration: "12 horas",
    periodId: "5",
    subject: "Semiologia",
    thumbnailUrl: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=300&fit=crop",
    rating: 5.0,
    studentsCount: 2340,
    includes: [
      "12 horas de aulas práticas",
      "Vídeos de exame físico",
      "Roteiros de anamnese",
      "Casos clínicos comentados",
      "Certificado",
    ],
  },
  // 6º Período
  {
    id: "c13",
    title: "Clínica Médica I",
    slug: "clinica-medica-1",
    shortDescription: "Introdução às grandes síndromes clínicas",
    longDescription: "Estude as principais síndromes da clínica médica com abordagem prática e voltada para a residência.",
    price: 149.90,
    duration: "10 horas",
    periodId: "6",
    subject: "Clínica Médica",
    thumbnailUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=300&fit=crop",
    rating: 4.9,
    studentsCount: 1780,
    includes: [
      "10 horas de aulas",
      "Casos clínicos",
      "Fluxogramas diagnósticos",
      "Questões de residência",
      "Certificado",
    ],
  },
  {
    id: "c14",
    title: "Cardiologia Essencial",
    slug: "cardiologia-essencial",
    shortDescription: "Bases da cardiologia para o estudante de medicina",
    longDescription: "Aprenda ECG, síndromes coronarianas, insuficiência cardíaca e arritmias de forma didática e prática.",
    price: 139.90,
    duration: "8 horas",
    periodId: "6",
    subject: "Cardiologia",
    thumbnailUrl: "https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=400&h=300&fit=crop",
    rating: 4.8,
    studentsCount: 1450,
    includes: [
      "8 horas de videoaulas",
      "Curso de ECG incluso",
      "Casos clínicos",
      "Simulador de ECG",
    ],
  },
];

export const getCoursesByPeriod = (periodSlug: string): Course[] => {
  const period = periods.find(p => p.slug === periodSlug);
  if (!period) return [];
  return courses.filter(c => c.periodId === period.id);
};

export const getCourseBySlug = (slug: string): Course | undefined => {
  return courses.find(c => c.slug === slug);
};

export const getPeriodBySlug = (slug: string): Period | undefined => {
  return periods.find(p => p.slug === slug);
};
