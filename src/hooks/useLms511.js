import { useState, useEffect, useCallback } from "react";
import { fetchSensors, fetchLatest, fetchHistory } from "../services/lms511Api";
import { usePlatform } from "../context/PlatformContext";
import { mockCintas } from "../data/mockData";

const POLL_INTERVAL_MS = 30_000;

const DEMO_SENSORS = [{
  site: mockCintas.latest.site,
  host: mockCintas.latest.host,
}];

export function useLms511() {
  const { demoMode } = usePlatform();

  const [sensors, setSensors] = useState(demoMode ? DEMO_SENSORS : []);
  const [selectedSensor, setSelectedSensor] = useState(
    demoMode ? { site: mockCintas.latest.site, host: mockCintas.latest.host } : null
  );
  const [granularity, setGranularity] = useState("daily");
  const [latest, setLatest] = useState(demoMode ? mockCintas.latest : null);
  const [history, setHistory] = useState(demoMode ? mockCintas.history : []);
  const [loading, setLoading] = useState(!demoMode);
  const [noData, setNoData] = useState(false);
  const [configError, setConfigError] = useState(false);

  // When demo mode flips on (or initial mount in demo), seed with mock data and skip network.
  useEffect(() => {
    if (!demoMode) return;
    setSensors(DEMO_SENSORS);
    setSelectedSensor({ site: mockCintas.latest.site, host: mockCintas.latest.host });
    setLatest(mockCintas.latest);
    setHistory(mockCintas.history);
    setLoading(false);
    setNoData(false);
    setConfigError(false);
  }, [demoMode]);

  // Load sensor list once on mount (skip in demo mode).
  useEffect(() => {
    if (demoMode) return;
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
        setNoData(true);
        setLoading(false);
      }
    });
  }, [demoMode]);

  const loadData = useCallback(async () => {
    if (demoMode || !selectedSensor) return;
    const { site, host } = selectedSensor;

    const [latestRes, historyRes] = await Promise.all([
      fetchLatest(site, host),
      fetchHistory(site, host, granularity),
    ]);

    setLatest(latestRes.data);
    setHistory(historyRes.data ?? []);
    setNoData(!latestRes.data && !historyRes.data?.length);
    setLoading(false);
  }, [demoMode, selectedSensor, granularity]);

  useEffect(() => {
    if (demoMode || !selectedSensor) return;
    setLoading(true);
    loadData();
  }, [demoMode, selectedSensor, loadData]);

  useEffect(() => {
    if (demoMode || !selectedSensor) return;
    const id = setInterval(loadData, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [demoMode, selectedSensor, loadData]);

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
