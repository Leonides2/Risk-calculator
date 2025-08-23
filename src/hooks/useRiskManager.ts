import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Risk, PROBABILITY_LEVELS, IMPACT_LEVELS, calculateRiskLevel } from '@/lib/types';

export function useRiskManager() {
  const [risks, setRisks] = useState<Risk[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('risk-calculator-risks');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [formData, setFormData] = useState({
    id: '',
    description: '',
    probability: PROBABILITY_LEVELS[0],
    impact: IMPACT_LEVELS[0],
  });

  const [isEditing, setIsEditing] = useState(false);

  // Guardar en localStorage cuando cambien los riesgos
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('risk-calculator-risks', JSON.stringify(risks));
    }
  }, [risks]);

  const calculateRiskScore = (probability: number, impact: number): number => {
    return probability * impact;
  };

  const addOrUpdateRisk = () => {
    const { id, description, probability, impact } = formData;
    
    if (!description.trim()) return;

    const riskScore = calculateRiskScore(probability.value, impact.value);
    const riskLevel = calculateRiskLevel(riskScore);

    const risk: Risk = {
      id: id || uuidv4(),
      description,
      probability,
      impact,
      riskScore,
      riskLevel,
      createdAt: id ? new Date() : new Date(),
    };

    if (isEditing) {
      setRisks(risks.map(r => (r.id === id ? risk : r)));
    } else {
      setRisks([...risks, risk]);
    }

    resetForm();
  };

  const editRisk = (id: string) => {
    const riskToEdit = risks.find(risk => risk.id === id);
    if (riskToEdit) {
      setFormData({
        id: riskToEdit.id,
        description: riskToEdit.description,
        probability: riskToEdit.probability,
        impact: riskToEdit.impact,
      });
      setIsEditing(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const deleteRisk = (id: string) => {
    setRisks(risks.filter(risk => risk.id !== id));
  };

  const resetForm = () => {
    setFormData({
      id: '',
      description: '',
      probability: PROBABILITY_LEVELS[0],
      impact: IMPACT_LEVELS[0],
    });
    setIsEditing(false);
  };

  const clearAllRisks = () => {
    if (confirm('¿Estás seguro de que deseas eliminar todos los riesgos?')) {
      setRisks([]);
    }
  };

  const getRiskStatistics = () => {
    const total = risks.length;
    const low = risks.filter(r => r.riskLevel === 'Bajo').length;
    const medium = risks.filter(r => r.riskLevel === 'Medio').length;
    const high = risks.filter(r => r.riskLevel === 'Alto').length;

    return {
      total,
      low,
      medium,
      high,
      lowPercentage: total > 0 ? Math.round((low / total) * 100) : 0,
      mediumPercentage: total > 0 ? Math.round((medium / total) * 100) : 0,
      highPercentage: total > 0 ? Math.round((high / total) * 100) : 0,
    };
  };

  return {
    risks,
    formData,
    setFormData,
    isEditing,
    addOrUpdateRisk,
    editRisk,
    deleteRisk,
    resetForm,
    clearAllRisks,
    getRiskStatistics,
  };
}
