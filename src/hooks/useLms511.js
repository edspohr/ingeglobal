import { useState, useEffect, useCallback } from "react";
import { fetchSensors, fetchLatest, fetchHistory } from "../services/lms511Api";

const POLL_INTERVAL_MS = 30_000;

export function useLms511() {
  const [sensors, setSensors] = useState([]);          // [] = connected, no data yet
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [granularity, setGranularity] = useState("daily");
  const [latest, setLatest] = useState(null);           // null = no live data
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);          // true when Supabase replies but is empty
  const [configError, setConfigError] = useState(false);// true when env vars missing

  // Load sensor list once on mount
  useEffect(() => {
    fetchSensors().then(({ data, error }) => {
      if (error === "not_configured") {
        setConfigError(true);
        setLoading(false);
        return;
      }
      if (data && data.length > 0) {
        setSensors(data);
        setSelectedSensor({ site: data[0].site, host: data[0].host });
      } else {
        // Connected but no sensors registered yet
        setNoData(true);
        setLoading(false);
      }
    });
  }, []);

  const loadData = useCallback(async () => {
    if (!selectedSensor) return;
    const { site, host } = selectedSensor;

    const [latestRes, historyRes] = await Promise.all([
      fetchLatest(site, host),
      fetchHistory(site, host, granularity),
    ]);

    setLatest(latestRes.data);
    setHistory(historyRes.data ?? []);
    setNoData(!latestRes.data && !historyRes.data?.length);
    setLoading(false);
  }, [selectedSensor, granularity]);

  useEffect(() => {
    if (!selectedSensor) return;
    setLoading(true);
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!selectedSensor) return;
    const id = setInterval(loadData, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [loadData]);

  return {
    sensors,
    selectedSensor,
    setSelectedSensor,
    granularity,
    setGranularity,
    latest,
    history,
    loading,
    noData,
    configError,
  };
}
