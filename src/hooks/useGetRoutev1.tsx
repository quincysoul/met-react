import axios, { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { LocalStorage, MemoryStorage } from 'ttl-localstorage';
import { Route } from '../types/Api';

const URI = 'https://svc.metrotransit.org/nextripv2/routes';
const KEY = 'routeList';
const CACHE_SECONDS = 30;

const useGetRouteListv1 = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<any>(null);

  const fetchData = useCallback((async (controller: AbortController) => {
    setLoading(true);
    const fullUri = `${URI}`;

    try {
      let routeList = [];
      let localStorage = LocalStorage;
      if (!localStorage.isLocalStorageAvailable()) {
        localStorage = MemoryStorage;
      }
      if (localStorage.get(fullUri) !== null) {
        routeList = localStorage.get(fullUri);
      }
      else {
        const res = await axios.get(fullUri, { signal: controller.signal });
        routeList = res?.data ?? [];
        localStorage.put(fullUri, routeList, CACHE_SECONDS);
      }
      setData(routeList);
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
  }), []);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller);
  }, [fetchData]);

  return {
    data, setData, error, loading,
  };
};

export default useGetRouteListv1;
