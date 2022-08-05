import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { LocalStorage, MemoryStorage } from 'ttl-localstorage';
import { Departure, NexTripResult, Stop } from '../types/Api';

const URI = 'https://svc.metrotransit.org/nextripv2';
const KEY = 'departureList';
const CACHE_SECONDS = 30;

const useGetDepartureListFromStopv1 = ({ stopId }: { stopId: number | null }) => {
  const [data, setData] = useState<NexTripResult | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<any>(null);

  const fetchData = useCallback((async (controller: AbortController) => {
    if (!stopId) return;
    setLoading(true);
    const fullUri = `${URI}/${stopId}`;

    try {
      let nexTripObj: NexTripResult = {};
      let localStorage = LocalStorage;
      if (!localStorage.isLocalStorageAvailable()) {
        localStorage = MemoryStorage;
      }
      if (localStorage.get(KEY) !== null) {
        nexTripObj = localStorage.get(KEY);
      }
      else {
        const res = await axios.get(fullUri, { signal: controller.signal });
        nexTripObj = res?.data ?? [];
        localStorage.put(KEY, nexTripObj, CACHE_SECONDS);
      }
      setData(nexTripObj);
      setError(null);
    }
    catch (err) {
      console.error(err);
      setError(`${err}`);
    }
    finally {
      setLoading(false);
    }
    // eslint-disable-next-line consistent-return
    return () => {
      controller.abort('Request aborted due to unmount of component');
    };
  }), [stopId]);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller);
  }, [fetchData]);

  return {
    data, setData, error, loading,
  };
};

export default useGetDepartureListFromStopv1;
