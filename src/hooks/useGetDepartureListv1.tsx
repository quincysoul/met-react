import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { LocalStorage, MemoryStorage } from 'ttl-localstorage';
import { Departure, NexTripResult, Stop } from '../types/Api';

const URI = 'https://svc.metrotransit.org/nextripv2';
const KEY = 'departureList';
const CACHE_SECONDS = 30;

// : {routeId: number, directionId: number, placeCode: number }
const useGetDepartureListv1 = ({ routeId, directionId, placeCode }: any) => {
  const [data, setData] = useState<NexTripResult>({});
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<any>(null);

  const fetchData = useCallback((async (controller: AbortController) => {
    setLoading(true);
    const fullUri = `${URI}/${routeId}/${directionId}/${placeCode}`;

    try {
      let nexTripObj = {};
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
    return () => {
      controller.abort('Request aborted due to unmount of component');
    };
  }), [directionId, placeCode, routeId]);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller);
  }, [fetchData]);

  return {
    data, setData, error, loading,
  };
};

export default useGetDepartureListv1;
