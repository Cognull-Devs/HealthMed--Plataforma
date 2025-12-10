import { Link } from 'react-router-dom';
import { BookOpen, Users, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { courses, periods } from '@/data/courses';

const AdminHome = () => {
  const stats = [
    {
      icon: BookOpen,
      label: 'Total de Aulas',
      value: courses.length,
      change: '+3 este mês',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Users,
      label: 'Alunos Ativos',
      value: '5.234',
      change: '+12% vs mês anterior',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: DollarSign,
      label: 'Receita do Mês',
      value: 'R$ 45.890',
      change: '+8% vs mês anterior',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: TrendingUp,
      label: 'Taxa de Conclusão',
      value: '78%',
      change: '+5% vs mês anterior',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral da plataforma HealthMed
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-6 rounded-2xl">
            <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
            <p className="font-heading text-3xl font-bold mb-2">{stat.value}</p>
            <p className="text-sm text-green-500">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl font-semibold">Aulas Recentes</h2>
            <Link 
              to="/admin/aulas"
              className="text-primary text-sm font-medium flex items-center gap-1 hover:underline"
            >
              Ver todas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {courses.slice(0, 4).map((course) => (
              <div key={course.id} className="flex items-center gap-4">
                <img 
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-16 h-12 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{course.title}</p>
                  <p className="text-sm text-muted-foreground">{course.subject}</p>
                </div>
                <span className="text-primary font-bold">
                  R$ {course.price.toFixed(2).replace('.', ',')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Periods Overview */}
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl font-semibold">Períodos</h2>
          </div>
          
          <div className="space-y-4">
            {periods.map((period) => {
              const periodCourses = courses.filter(c => c.periodId === period.id);
              return (
                <div key={period.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{period.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {periodCourses.length} aulas cadastradas
                    </p>
                  </div>
                  <Link 
                    to={`/admin/aulas?periodo=${period.id}`}
                    className="text-primary hover:underline text-sm"
                  >
                    Gerenciar
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
