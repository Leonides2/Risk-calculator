"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PROBABILITY_LEVELS, IMPACT_LEVELS } from '@/lib/types';
import { useRisk } from '@/context/RiskContext';

export function RiskForm() {
  const {
    formData,
    setFormData,
    isEditing,
    addOrUpdateRisk,
    resetForm,
  } = useRisk();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addOrUpdateRisk();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold mb-6">
        {isEditing ? 'Editar Riesgo' : 'Agregar Nuevo Riesgo'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="description">Descripción del Riesgo</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Ej. Pérdida de datos por falla en el servidor"
            required
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="probability">Probabilidad</Label>
            <Select
              value={formData.probability.value.toString()}
              onValueChange={(value) => {
                const prob = PROBABILITY_LEVELS.find(p => p.value === parseInt(value)) || PROBABILITY_LEVELS[0];
                setFormData({ ...formData, probability: prob });
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecciona la probabilidad" />
              </SelectTrigger>
              <SelectContent>
                {PROBABILITY_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value.toString()}>
                    <div>
                      <div className="font-medium">{level.label}</div>
                      <div className="text-xs text-muted-foreground">{level.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="impact">Impacto</Label>
            <Select
              value={formData.impact.value.toString()}
              onValueChange={(value) => {
                const impact = IMPACT_LEVELS.find(i => i.value === parseInt(value)) || IMPACT_LEVELS[0];
                setFormData({ ...formData, impact });
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecciona el impacto" />
              </SelectTrigger>
              <SelectContent>
                {IMPACT_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value.toString()}>
                    <div>
                      <div className="font-medium">{level.label}</div>
                      <div className="text-xs text-muted-foreground">{level.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex flex-wrap gap-2">
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              {isEditing ? 'Actualizar Riesgo' : 'Agregar Riesgo'}
            </Button>
            
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="ml-2"
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
