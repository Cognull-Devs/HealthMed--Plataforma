import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { courses, periods } from '@/data/courses';
import { useState } from 'react';

const AdminCourses = () => {
  const [search, setSearch] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
                         course.subject.toLowerCase().includes(search.toLowerCase());
    const matchesPeriod = selectedPeriod === 'all' || course.periodId === selectedPeriod;
    return matchesSearch && matchesPeriod;
  });

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold mb-2">Gerenciar Aulas</h1>
          <p className="text-muted-foreground">
            {filteredCourses.length} aulas cadastradas
          </p>
        </div>
        <Link to="/admin/aulas/nova">
          <Button className="btn-primary">
            <PlusCircle className="w-4 h-4 mr-2" />
            Nova Aula
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar aulas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="input-field min-w-[180px]"
        >
          <option value="all">Todos os períodos</option>
          {periods.map(period => (
            <option key={period.id} value={period.id}>
              {period.name}
            </option>
          ))}
        </select>
      </div>

      {/* Courses Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-semibold">Aula</th>
                <th className="text-left p-4 font-semibold">Período</th>
                <th className="text-left p-4 font-semibold">Preço</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-right p-4 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => {
                const period = periods.find(p => p.id === course.periodId);
                return (
                  <tr key={course.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-20 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium line-clamp-1">{course.title}</p>
                          <p className="text-sm text-muted-foreground">{course.subject}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                        {period?.name}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold">{formatPrice(course.price)}</span>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 text-green-500">
                        <Eye className="w-4 h-4" />
                        Visível
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/admin/aulas/editar/${course.slug}`}
                          className="p-2 rounded-lg hover:bg-secondary transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                          <EyeOff className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredCourses.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">Nenhuma aula encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourses;
