'use server';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { statsInterface } from '../RiskList';
import { Risk } from '@/lib/types';

export async function exportRisksToMarkdown(risks: Risk[], stats: statsInterface) {
  let content = '# Análisis de Riesgos\n\n';

   // Encabezado
      content += `> **Generado el:** ${new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}\n\n`;

      content += '## Resumen de Riesgos\n\n';
      content += '| Categoría | Cantidad | Porcentaje |\n';
      content += '|-----------|----------|------------|\n';
      content += `| **Total** | ${stats.total} | 100% |\n`;
      content += `| **Bajo** | ${stats.low} | ${stats.lowPercentage}% |\n`;
      content += `| **Medio** | ${stats.medium} | ${stats.mediumPercentage}% |\n`;
      content += `| **Alto** | ${stats.high} | ${stats.highPercentage}% |\n\n`;
      
      // Lista de riesgos
      content += '## Lista de Riesgos\n\n';
      risks.forEach((risk, index) => {
        content += `### Riesgo #${index + 1}\n\n`;
        content += `- **Descripción:** ${risk.description}\n`;
        content += `- **Probabilidad:** ${risk.probability.label} (${risk.probability.description})\n`;
        content += `- **Impacto:** ${risk.impact.label} (${risk.impact.description})\n`;
        content += `- **Nivel de Riesgo:** \`${risk.riskLevel}\` (Puntuación: ${risk.riskScore})\n`;
        content += `- **Fecha:** ${format(new Date(risk.createdAt), "PPP", { locale: es })}\n\n`;
      });
      
      // Estadísticas adicionales
      content += '## Estadísticas\n\n';
      content += '```\n';
      content += `Total de riesgos: ${stats.total}\n`;
      content += `Riesgos Bajos:   ${stats.low} (${stats.lowPercentage}%)\n`;
      content += `Riesgos Medios:  ${stats.medium} (${stats.mediumPercentage}%)\n`;
      content += `Riesgos Altos:   ${stats.high} (${stats.highPercentage}%)\n`;
      content += '```\n';
     
  return content;
}