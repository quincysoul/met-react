import axios, { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Route } from '../types/Api';

const useGetRoutev1 = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<any>(null);

  const fetchData = useCallback((async (controller: AbortController) => {
    setLoading(true);

    try {
      // const parrotDevTools = false;
      let res: Partial<AxiosResponse<Route[]>> = {};
      // if (parrotDevTools) {
      //   const uri = 'http://localhost:3050/todos';
      //   res = await axios.get(uri, { signal: controller.signal });
      //   setData(res.data);
      // } else {
      //   setData(JSON.parse(tasksSuccess));
      // }
      const uri = 'https://svc.metrotransit.org/nextripv2/routes';
      res = await axios.get(uri, { signal: controller.signal });
      setData(res?.data ?? []);
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

export default useGetRoutev1;
