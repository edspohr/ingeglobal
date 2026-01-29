import React, { useState, useEffect } from 'react';
import { mockSensorData } from '../data/mockData';
import { FileText, Download, Filter, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const CamionesModule = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetch
        setTimeout(() => {
            setData(mockSensorData.camiones);
            setLoading(false);
        }, 500);
    }, []);

    const generatePDF = (period) => {
        const doc = new jsPDF();
        
        // Header
        doc.setFillColor(15, 23, 42); // brand-dark
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("Reporte de Control de Transporte", 14, 20);
        
        doc.setFontSize(10);
        doc.text(`Periodo: ${period}`, 14, 30);
        doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 35);

        // Table
        const headers = [['ID', 'Patente', 'Empresa', 'Material', 'Hora', 'Volumen (m³)', 'Estado']];
        const rows = data.map(row => [
            row.id,
            row.plate,
            row.company,
            row.material,
            row.time,
            row.volume,
            row.status
        ]);

        doc.autoTable({
            head: headers,
            body: rows,
            startY: 45,
            theme: 'grid',
            headStyles: { fillColor: [212, 162, 78], textColor: 0 }, // brand-gold
            alternateRowStyles: { fillColor: [245, 245, 245] },
            styles: { fontSize: 8 }
        });

        // Summary
        const totalVol = data.reduce((acc, curr) => acc + curr.volume, 0);
        const finalY = doc.lastAutoTable.finalY + 10;
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`Total Volumen Transportado: ${totalVol} m³`, 14, finalY);

        doc.save(`reporte_camiones_${period.toLowerCase()}.pdf`);
    };

    if (loading) return <div>Cargando datos de transporte...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Reportes de Transporte</h1>
                    <p className="text-gray-400">Registro detallado de ingreso y salida de material.</p>
                </div>
                
                <div className="flex gap-2">
                    <button 
                        onClick={() => generatePDF('Diario')}
                        className="flex items-center space-x-2 px-4 py-2 bg-brand-gold text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors"
                    >
                        <FileText size={18} />
                        <span>PDF Diario</span>
                    </button>
                    <button 
                        onClick={() => generatePDF('Semanal')}
                        className="flex items-center space-x-2 px-4 py-2 bg-white/5 text-white font-medium rounded-lg hover:bg-white/10 border border-white/10 transition-colors"
                    >
                        <Printer size={18} />
                        <span>Semanal</span>
                    </button>
                </div>
            </div>
            
            <div className="glass-panel rounded-xl overflow-hidden border border-white/5"> 
                <div className="p-4 border-b border-white/5 flex gap-4">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="Filtrar por patente..." 
                            className="bg-black/20 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-gold w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-xs text-gray-400 uppercase tracking-wider">
                                <th className="p-4 font-semibold">ID Transacción</th>
                                <th className="p-4 font-semibold">Patente</th>
                                <th className="p-4 font-semibold">Empresa</th>
                                <th className="p-4 font-semibold">Material</th>
                                <th className="p-4 text-center font-semibold">Hora Entrada</th>
                                <th className="p-4 text-center font-semibold">Volumen (m³)</th>
                                <th className="p-4 text-center font-semibold">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {data.map((truck, idx) => (
                                <tr key={truck.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4 font-mono text-gray-500">{truck.id}</td>
                                    <td className="p-4 font-bold text-white">{truck.plate}</td>
                                    <td className="p-4 text-gray-300">{truck.company}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${truck.material === 'Cobre' ? 'bg-orange-500/10 text-orange-400' : 'bg-gray-500/10 text-gray-400'}`}>
                                            {truck.material}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center text-gray-300">{truck.time}</td>
                                    <td className="p-4 text-center font-bold text-brand-gold">{truck.volume}</td>
                                    <td className="p-4 text-center">
                                         <span className={`
                                            inline-flex items-center px-2 py-1 rounded-full text-xs font-bold
                                            ${truck.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 
                                              truck.status === 'processing' ? 'bg-blue-500/10 text-blue-400' : 
                                              'bg-yellow-500/10 text-yellow-400'}
                                         `}>
                                            {truck.status === 'completed' ? 'Completado' : truck.status === 'processing' ? 'En Proceso' : 'Ingresando'}
                                         </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CamionesModule;
