export interface Risk {
  id: string;
  description: string;
  probability: ProbabilityLevel;
  impact: ImpactLevel;
  riskScore: number;
  riskLevel: 'Bajo' | 'Medio' | 'Alto';
  createdAt: Date;
}

export interface ProbabilityLevel {
  value: number;
  label: string;
  description: string;
}

export interface ImpactLevel {
  value: number;
  label: string;
  description: string;
}

export const PROBABILITY_LEVELS: ProbabilityLevel[] = [
  { value: 1, label: 'Muy Baja', description: '0-10% de probabilidad' },
  { value: 2, label: 'Baja', description: '11-30% de probabilidad' },
  { value: 3, label: 'Media', description: '31-50% de probabilidad' },
  { value: 4, label: 'Alta', description: '51-80% de probabilidad' },
  { value: 5, label: 'Muy Alta', description: '81-100% de probabilidad' },
];

export const IMPACT_LEVELS: ImpactLevel[] = [
  { value: 1, label: 'Insignificante', description: 'Impacto mínimo' },
  { value: 2, label: 'Menor', description: 'Impacto bajo' },
  { value: 3, label: 'Moderado', description: 'Impacto medio' },
  { value: 4, label: 'Mayor', description: 'Impacto alto' },
  { value: 5, label: 'Catastrófico', description: 'Impacto crítico' },
];

export function calculateRiskLevel(score: number): 'Bajo' | 'Medio' | 'Alto' {
  if (score <= 6) return 'Bajo';
  if (score <= 12) return 'Medio';
  return 'Alto';
}

export function getRiskLevelColor(level: 'Bajo' | 'Medio' | 'Alto'): string {
  const colors = {
    Bajo: 'bg-risk-low/20 text-risk-low',
    Medio: 'bg-risk-medium/20 text-risk-medium',
    Alto: 'bg-risk-high/20 text-risk-high',
  };
  return colors[level];
}
