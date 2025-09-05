'use client';

import React, { createContext, useContext, ReactNode, useReducer, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Risk, PROBABILITY_LEVELS, IMPACT_LEVELS, calculateRiskLevel } from '@/lib/types';

type RiskState = {
  risks: Risk[];
  formData: {
    id: string;
    description: string;
    probability: { value: number; label: string; description: string };
    impact: { value: number; label: string; description: string };
  };
  isEditing: boolean;
};

type RiskAction =
  | { type: 'SET_RISKS'; payload: Risk[] }
  | { type: 'SET_FORM_DATA'; payload: Partial<RiskState['formData']> }
  | { type: 'SET_IS_EDITING'; payload: boolean }
  | { type: 'ADD_RISK'; payload: Risk }
  | { type: 'UPDATE_RISK'; payload: Risk }
  | { type: 'DELETE_RISK'; payload: string }
  | { type: 'RESET_FORM' };

const initialState: RiskState = {
  risks: [],
  formData: {
    id: '',
    description: '',
    probability: PROBABILITY_LEVELS[0],
    impact: IMPACT_LEVELS[0],
  },
  isEditing: false,
};

function riskReducer(state: RiskState, action: RiskAction): RiskState {
  switch (action.type) {
    case 'SET_RISKS':
      return { ...state, risks: action.payload };
    case 'SET_FORM_DATA':
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
      };
    case 'SET_IS_EDITING':
      return { ...state, isEditing: action.payload };
    case 'ADD_RISK':
      return {
        ...state,
        risks: [...state.risks, action.payload],
      };
    case 'UPDATE_RISK':
      return {
        ...state,
        risks: state.risks.map(risk =>
          risk.id === action.payload.id ? action.payload : risk
        ),
      };
    case 'DELETE_RISK':
      return {
        ...state,
        risks: state.risks.filter(risk => risk.id !== action.payload),
      };
    case 'RESET_FORM':
      return {
        ...state,
        formData: initialState.formData,
        isEditing: false,
      };
    default:
      return state;
  }
}

type RiskContextType = RiskState & {
  setRisks: (risks: Risk[]) => void;
  setFormData: (data: Partial<RiskState['formData']>) => void;
  addOrUpdateRisk: () => void;
  editRisk: (id: string) => void;
  deleteRisk: (id: string) => void;
  resetForm: () => void;
  getRiskStatistics: () => {
    total: number;
    low: number;
    medium: number;
    high: number;
    lowPercentage: number;
    mediumPercentage: number;
    highPercentage: number;
  };
};

const RiskContext = createContext<RiskContextType | undefined>(undefined);

export function RiskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(riskReducer, loadInitialState());

  // Load from localStorage on mount
  function loadInitialState(): RiskState {
    if (typeof window === 'undefined') return initialState;
    
    const saved = localStorage.getItem('risk-calculator-risks');
    const savedRisks = saved ? JSON.parse(saved) : [];
    
    return {
      ...initialState,
      risks: savedRisks,
    };
  }

  // Save to localStorage when risks change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('risk-calculator-risks', JSON.stringify(state.risks));
    }
  }, [state.risks]);

  const calculateRiskScore = (probability: number, impact: number): number => {
    return probability * impact;
  };

  const setRisks = useCallback((risks: Risk[]) => {
    dispatch({ type: 'SET_RISKS', payload: risks });
  }, []);

  const setFormData = useCallback((data: Partial<RiskState['formData']>) => {
    dispatch({ type: 'SET_FORM_DATA', payload: data });
  }, []);

  const addOrUpdateRisk = useCallback(() => {
    const { id, description, probability, impact } = state.formData;
    
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

    if (state.isEditing) {
      dispatch({ type: 'UPDATE_RISK', payload: risk });
    } else {
      dispatch({ type: 'ADD_RISK', payload: risk });
    }

    dispatch({ type: 'RESET_FORM' });
  }, [state.formData, state.isEditing]);

  const editRisk = useCallback((id: string) => {
    const riskToEdit = state.risks.find(risk => risk.id === id);
    if (riskToEdit) {
      dispatch({
        type: 'SET_FORM_DATA',
        payload: {
          id: riskToEdit.id,
          description: riskToEdit.description,
          probability: riskToEdit.probability,
          impact: riskToEdit.impact,
        },
      });
      dispatch({ type: 'SET_IS_EDITING', payload: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [state.risks]);

  const deleteRisk = useCallback((id: string) => {
    dispatch({ type: 'DELETE_RISK', payload: id });
  }, []);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  const getRiskStatistics = useCallback(() => {
    const total = state.risks.length;
    const low = state.risks.filter(r => r.riskLevel === 'Bajo').length;
    const medium = state.risks.filter(r => r.riskLevel === 'Medio').length;
    const high = state.risks.filter(r => r.riskLevel === 'Alto').length;

    return {
      total,
      low,
      medium,
      high,
      lowPercentage: total > 0 ? Math.round((low / total) * 100) : 0,
      mediumPercentage: total > 0 ? Math.round((medium / total) * 100) : 0,
      highPercentage: total > 0 ? Math.round((high / total) * 100) : 0,
    };
  }, [state.risks]);

  return (
    <RiskContext.Provider
      value={{
        ...state,
        setRisks,
        setFormData,
        addOrUpdateRisk,
        editRisk,
        deleteRisk,
        resetForm,
        getRiskStatistics,
      }}
    >
      {children}
    </RiskContext.Provider>
  );
}

export function useRisk() {
  const context = useContext(RiskContext);
  if (context === undefined) {
    throw new Error('useRisk must be used within a RiskProvider');
  }
  return context;
}

export default RiskContext;
