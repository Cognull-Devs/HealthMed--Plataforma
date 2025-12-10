import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { periods } from '@/data/courses';
import { toast } from 'sonner';

const AdminNewCourse = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    periodId: '',
    subject: '',
    shortDescription: '',
    longDescription: '',
    price: '',
    duration: '',
    thumbnailUrl: '',
    order: '',
  });
  const [includes, setIncludes] = useState<string[]>(['']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate
    if (!formData.title || !formData.periodId || !formData.price) {
      toast.error('Preencha todos os campos obrigatórios');
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success('Aula criada com sucesso!');
    navigate('/admin/aulas');
  };

  const addInclude = () => {
    setIncludes([...includes, '']);
  };

  const removeInclude = (index: number) => {
    setIncludes(includes.filter((_, i) => i !== index));
  };

  const updateInclude = (index: number, value: string) => {
    const newIncludes = [...includes];
    newIncludes[index] = value;
    setIncludes(newIncludes);
  };

  return (
    <div className="max-w-4xl">
      <button 
        onClick={() => navigate('/admin/aulas')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para aulas
      </button>

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold mb-2">Nova Aula</h1>
        <p className="text-muted-foreground">
          Preencha os dados abaixo para criar uma nova aula
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <h2 className="font-heading text-xl font-semibold">Informações Básicas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Título da Aula *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Anatomia Humana Básica"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Período *
              </label>
              <select
                value={formData.periodId}
                onChange={(e) => setFormData({ ...formData, periodId: e.target.value })}
                className="input-field w-full"
                required
              >
                <option value="">Selecione o período</option>
                {periods.map(period => (
                  <option key={period.id} value={period.id}>
                    {period.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Matéria *
              </label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Ex: Anatomia"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Preço (R$) *
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="99.90"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Duração
              </label>
              <Input
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="Ex: 8 horas"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Ordem de exibição
              </label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                placeholder="1"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Descriptions */}
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <h2 className="font-heading text-xl font-semibold">Descrições</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Descrição Curta *
            </label>
            <Input
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Breve descrição que aparece no card"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Descrição Completa *
            </label>
            <Textarea
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              placeholder="Descrição detalhada da aula..."
              className="input-field min-h-[150px]"
              required
            />
          </div>
        </div>

        {/* What's Included */}
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <h2 className="font-heading text-xl font-semibold">O que está incluso</h2>
          
          <div className="space-y-3">
            {includes.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => updateInclude(index, e.target.value)}
                  placeholder="Ex: 8 horas de vídeo em HD"
                  className="input-field flex-1"
                />
                {includes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInclude(index)}
                    className="p-3 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <button
            type="button"
            onClick={addInclude}
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <Plus className="w-4 h-4" />
            Adicionar item
          </button>
        </div>

        {/* Media */}
        <div className="glass-card p-6 rounded-2xl space-y-6">
          <h2 className="font-heading text-xl font-semibold">Mídia</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              URL da Thumbnail
            </label>
            <Input
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              placeholder="https://..."
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Upload de Vídeo (MUX)
            </label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">
                Arraste o vídeo ou clique para selecionar
              </p>
              <p className="text-xs text-muted-foreground">
                O vídeo será enviado para o MUX automaticamente
              </p>
              <Button type="button" variant="outline" className="mt-4">
                Selecionar Arquivo
              </Button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/aulas')}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex-1"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Criando...
              </span>
            ) : (
              'Criar Aula'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminNewCourse;
