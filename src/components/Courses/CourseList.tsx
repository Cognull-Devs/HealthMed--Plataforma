// src/components/Courses/CourseList.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Period {
  id: string;
  name: string;
  description: string;
}

interface Course {
  id: string;
  title: string;
  subject: string;
  period_id: string;
}

interface CourseListProps {
  userId: string;
  onAddToCart: (courseId: string) => void;
}

export default function CourseList({ userId, onAddToCart }: CourseListProps) {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPeriods();
    loadCourses();
  }, []);

  const loadPeriods = async () => {
    try {
      const { data, error } = await supabase
        .from('periods')
        .select('*')
        .order('name')
        .returns<Period[]>();

      if (error) throw error;
      
      if (data && data.length > 0) {
        setPeriods(data);
        setSelectedPeriod(data[0].id);
      } else {
        setPeriods([]);
      }
    } catch (err) {
      console.error('Erro ao carregar períodos:', err);
    }
  };

  const loadCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('title')
        .returns<Course[]>();

      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      console.error('Erro ao carregar cursos:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = selectedPeriod
    ? courses.filter(c => c.period_id === selectedPeriod)
    : courses;

  const selectedPeriodData = periods.find(p => p.id === selectedPeriod);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Cursos Disponíveis</h2>

      {/* Filtro de Períodos */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Filtrar por Período:</label>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os Períodos</option>
          {periods.map(period => (
            <option key={period.id} value={period.id}>
              {period.name}
            </option>
          ))}
        </select>
      </div>

      {/* Descrição do Período Selecionado */}
      {selectedPeriodData && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-6">
          <h3 className="font-semibold text-lg">{selectedPeriodData.name}</h3>
          <p className="text-gray-700">{selectedPeriodData.description}</p>
        </div>
      )}

      {/* Lista de Cursos */}
      {loading ? (
        <div className="text-center py-12">Carregando cursos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              Nenhum curso encontrado para este período
            </div>
          ) : (
            filteredCourses.map(course => (
              <div
                key={course.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
              >
                <div className="mb-3">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {course.subject}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <button
                  onClick={() => onAddToCart(course.id)}
                  className="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}