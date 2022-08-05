import axios, { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { LocalStorage, MemoryStorage } from 'ttl-localstorage';
import { Direction, Route } from '../types/Api';

const URI = 'https://svc.metrotransit.org/nextripv2/directions';
const KEY = 'directionList';
const CACHE_SECONDS = 30;

const useGetDirectionsv1 = ({ routeId }: { routeId: number }) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<any>(null);

  const fetchData = useCallback((async (controller: AbortController) => {
    setLoading(true);
    const fullUri = `${URI}/${routeId}`;

    try {
      let directionList: Direction[] = [];
      let localStorage = LocalStorage;
      if (!localStorage.isLocalStorageAvailable()) {
        localStorage = MemoryStorage;
      }
      if (localStorage.get(fullUri) !== null) {
        directionList = localStorage.get(fullUri);
      }
      else {
        const res = await axios.get(fullUri, { signal: controller.signal });
        directionList = res?.data ?? [];
        localStorage.put(fullUri, directionList, CACHE_SECONDS);
      }
      setData(directionList);
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
  }), [routeId]);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller);
  }, [fetchData]);

  return {
    data, setData, error, loading,
  };
};

export default useGetDirectionsv1;
