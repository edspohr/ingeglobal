import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Database, Truck, Layers, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLms511 } from '../hooks/useLms511';
import MetricCard from '../components/common/MetricCard';
import SkeletonBlock from '../components/common/SkeletonBlock';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const DashboardHome = () => {
  const { latest, loading, noData, configError } = useLms511();

  if (loading) return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <SkeletonBlock width={420} height={32} />
        <SkeletonBlock width={160} height={24} rounded="rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonBlock key={i} height={112} className="w-full" rounded="rounded-xl" />
        ))}
      </div>
    </div>
  );

  const hasFlow = !noData && !configError && latest;
  const flow_m3_h = hasFlow ? latest.flow_m3_h : null;
  const volume_day = hasFlow ? latest.volume_day_m3 : null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Resumen General de Operaciones</h1>
        {hasFlow ? (
          <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-bold border border-green-500/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            SISTEMA OPERATIVO
          </span>
        ) : (
          <span className="px-3 py-1 bg-gray-500/10 text-gray-500 rounded-full text-xs font-bold border border-gray-500/20 flex items-center gap-2">
            <Radio size={12} />
            SIN DATOS EN VIVO
          </span>
        )}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Flujo — real desde Supabase */}
        <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }}>
          <Link to="/dashboard/cintas" className="block">
            <MetricCard
              title="Flujo Volumétrico"
              value={flow_m3_h != null
                ? `${flow_m3_h.toLocaleString('es-CL', { maximumFractionDigits: 1 })} m³/h`
                : '— m³/h'}
              trend="up"
              trendValue={flow_m3_h != null ? 'En vivo' : 'Sin señal'}
              icon={Activity}
              color="brand-gold"
            />
          </Link>
        </motion.div>

        {/* Volumen diario — real desde Supabase */}
        <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }}>
          <Link to="/dashboard/cintas" className="block">
            <MetricCard
              title="Volumen Diario"
              value={volume_day != null
                ? `${Number(volume_day).toLocaleString('es-CL', { maximumFractionDigits: 0 })} m³`
                : '— m³'}
              trend="up"
              trendValue={volume_day != null ? 'Hoy' : 'Sin señal'}
              icon={Database}
              color="purple"
            />
          </Link>
        </motion.div>

        {/* Camiones — sin backend aún */}
        <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }}>
          <Link to="/dashboard/camiones" className="block">
            <MetricCard
              title="Camiones Turno"
              value="—"
              trend="up"
              trendValue="Sin datos"
              icon={Truck}
              color="emerald"
            />
          </Link>
        </motion.div>

        {/* Arcones — sin backend aún */}
        <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }}>
          <Link to="/dashboard/arcones" className="block">
            <MetricCard
              title="Stock Arcones"
              value="—"
              trend="up"
              trendValue="Sin datos"
              icon={Layers}
              color="blue"
            />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;
