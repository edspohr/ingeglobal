import React from 'react';
import { Database, Radio } from 'lucide-react';

const ArconesModule = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-white tracking-tight">Control de Arcones</h1>
    <div className="glass-panel rounded-xl flex flex-col items-center justify-center py-24 text-center space-y-3">
      <Radio size={28} className="text-gray-600" />
      <p className="text-gray-400 text-sm font-medium">Sin datos en vivo</p>
      <p className="text-gray-600 text-xs max-w-xs">
        Los niveles de arcones aparecerán aquí automáticamente cuando el sistema de medición esté conectado.
      </p>
    </div>
  </div>
);

export default ArconesModule;
