'use client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Edit, Trash2, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { getRiskLevelColor } from '@/lib/types';
import { useRisk } from '@/context/RiskContext';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function RiskList() {
  const { risks, deleteRisk, getRiskStatistics, editRisk, setRisks } = useRisk();
  
  const exportToMarkdown = async () => {
    if (risks.length === 0) {
      alert('No hay riesgos para exportar');
      return;
    }

    const stats = getRiskStatistics();
    const { exportRisksToMarkdown } = await import('./export/exportRiskToMarkdown');
    const markdownContent = await exportRisksToMarkdown(risks, stats);
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, `analisis-riesgos-${new Date().toISOString().split('T')[0]}.md`);
  };

  if (risks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Info className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No hay riesgos registrados</h3>
        <p className="text-muted-foreground">Agrega tu primer riesgo usando el formulario superior.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-xl font-semibold">Riesgos Registrados</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={exportToMarkdown}
            className="ml-2"
          >
            <Download className="h-4 w-4" />
            Exportar Markdown
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (confirm('¿Estás seguro de que deseas eliminar todos los riesgos?')) {
                setRisks([]);
              }
            }}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Limpiar Todo
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-center">Probabilidad</TableHead>
              <TableHead className="text-center">Impacto</TableHead>
              <TableHead className="text-center">Nivel de Riesgo</TableHead>
              <TableHead className="text-right">Fecha</TableHead>
              <TableHead className="w-24">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {risks.map((risk) => (
              <TableRow key={risk.id}>
                <TableCell className="font-medium">{risk.description}</TableCell>
                <TableCell className="text-center">
                  <span className="font-medium">{risk.probability.label}</span>
                  <div className="text-xs text-muted-foreground">
                    {risk.probability.description}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-medium">{risk.impact.label}</span>
                  <div className="text-xs text-muted-foreground">
                    {risk.impact.description}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(risk.riskLevel)}`}
                  >
                    {risk.riskLevel}
                    {risk.riskLevel === 'Alto' ? (
                      <AlertTriangle className="ml-1 h-3 w-3" />
                    ) : risk.riskLevel === 'Medio' ? (
                      <Info className="ml-1 h-3 w-3" />
                    ) : (
                      <CheckCircle className="ml-1 h-3 w-3" />
                    )}
                    <span className="ml-1">({risk.riskScore})</span>
                  </span>
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {format(new Date(risk.createdAt), "PPp", { locale: es })}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => editRisk(risk.id)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm('¿Estás seguro de que deseas eliminar este riesgo?')) {
                          deleteRisk(risk.id);
                        }
                      }}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
