'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar, Legend } from 'recharts';
import { useMemo } from 'react';
import { useRisk } from '@/context/RiskContext';

interface RiskMatrixProps {
  onCellClick?: (x: number, y: number) => void;
}

export function RiskMatrix({ onCellClick }: RiskMatrixProps) {
  const { risks } = useRisk();
  // Crear matriz 5x5 para contar riesgos por celda
  const matrix = useMemo(() => {
    const newMatrix = Array(5).fill(0).map(() => Array(5).fill(0));
    
    // Contar riesgos por celda
    risks.forEach(risk => {
      const x = risk.probability.value - 1;
      const y = risk.impact.value - 1;
      if (x >= 0 && x < 5 && y >= 0 && y < 5) {
        newMatrix[x][y]++;
      }
    });
    
    return newMatrix;
  }, [risks]); // Recalcular cuando cambien los riesgos

  // Datos para el gráfico de barras
  const riskLevelData = [
    { name: 'Bajo', value: risks.filter(r => r.riskLevel === 'Bajo').length },
    { name: 'Medio', value: risks.filter(r => r.riskLevel === 'Medio').length },
    { name: 'Alto', value: risks.filter(r => r.riskLevel === 'Alto').length },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Matriz de Riesgos</h3>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="grid grid-cols-6 gap-1 
            align-center border border-gray-200
            bg-gradient-to-br from-green-300 via-amber-300 to-red-300">
              {/* Encabezado superior (impacto) */}
              <div className="text-center font-medium p-2 ">Prob. \ Impacto</div>
              {[1, 2, 3, 4, 5].map((impact) => (
                <div key={`impact-${impact}`} className="text-center font-medium p-2">
                  {impact}
                </div>
              ))}
              
              {/* Filas de la matriz */}
              {matrix.map((row, x) => (
                <div key={`row-${x}`} className="contents">
                  <div key={`prob-${x}`} className="text-center font-medium p-2">
                    {x + 1}
                  </div>
                  {row.map((count, y) => (
                    <div
                      key={`cell-${x}-${y}`}
                      className={`w-full h-full flex items-center justify-center cursor-pointer transition-colors`}
                      onClick={() => onCellClick?.(x + 1, y + 1)}
                      title={`Probabilidad ${x + 1}, Impacto ${y + 1} - ${count} riesgo(s)`}
                    >
                      {count > 0 && (
                        <span className="text-lg font-bold">{count}</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Leyenda */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-risk-low/30 mr-2 border border-risk-low"></div>
            <span className="text-sm">Riesgo Bajo (1-6)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-risk-medium/30 mr-2 border border-risk-medium"></div>
            <span className="text-sm">Riesgo Medio (8-12)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-risk-high/30 mr-2 border border-risk-high"></div>
            <span className="text-sm">Riesgo Alto (15-25)</span>
          </div>
        </div>
      </div>

      {/* Gráficos de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Distribución de Niveles de Riesgo</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskLevelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent ?  percent * 100 : 0).toFixed(0)}%`}
                >
                  {riskLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Conteo por Nivel de Riesgo</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskLevelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Cantidad de Riesgos">
                  {riskLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
