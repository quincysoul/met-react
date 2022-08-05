import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { LocalStorage, MemoryStorage } from 'ttl-localstorage';
import { Place } from '../types/Api';

const URI = 'https://svc.metrotransit.org/nextripv2/stops';
const KEY = 'placeList';
const CACHE_SECONDS = 30;

const useGetPlaceListv1 = ({ routeId, directionId }: { routeId: number, directionId: number }) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<any>(null);

  const fetchData = useCallback((async (controller: AbortController) => {
    setLoading(true);
    const fullUri = `${URI}/${routeId}/${directionId}`;

    try {
      let placeList: Place[] = [];
      let localStorage = LocalStorage;
      if (!localStorage.isLocalStorageAvailable()) {
        localStorage = MemoryStorage;
      }
      if (localStorage.get(KEY) !== null) {
        placeList = localStorage.get(KEY);
      }
      else {
        const res = await axios.get(fullUri, { signal: controller.signal });
        placeList = res?.data ?? [];
        localStorage.put(KEY, placeList, CACHE_SECONDS);
      }
      setData(placeList);
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
  }), [directionId, routeId]);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller);
  }, [fetchData]);

  return {
    data, setData, error, loading,
  };
};

export default useGetPlaceListv1;
