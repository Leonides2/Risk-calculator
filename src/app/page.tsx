'use client';
import { RiskProvider } from '@/context/RiskContext';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { RiskForm } from '@/components/risk/RiskForm';

export default function Home() {
  const [selectedCell, setSelectedCell] = useState<{x: number, y: number} | null>(null);

  const RiskList = dynamic(() => import('@/components/risk/RiskList').then(mod => mod.RiskList), { ssr: false });
  const RiskMatrix = dynamic(() => import('@/components/risk/RiskMatrix').then(mod => mod.RiskMatrix), { ssr: false });

  const handleCellClick = (x: number, y: number) => {
    setSelectedCell({ x, y });
    console.log(`Celda clickeada: Probabilidad ${x + 1}, Impacto ${y + 1}`);
  };

  return (
    <RiskProvider>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Calculadora de Riesgos</h1>
            <p className="text-gray-600">
              Evalúa y visualiza los riesgos de tu proyecto de manera sencilla
            </p>
          </header>

          <main className="space-y-8">
            <RiskForm />
            <RiskMatrix onCellClick={handleCellClick} />
            <RiskList />
          </main>

          <footer className="mt-16 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Calculadora de Riesgos. Todos los derechos reservados.</p>
          </footer>
        </div>
      </div>
    </RiskProvider>
  );
}
