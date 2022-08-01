import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Select } from 'antd';
import useGetRoutev1 from '../hooks/useGetRoutev1';
import RouteSelectStep from './RouteSelectStep';

interface LocationState {
  formStep: number
}

function RouteSelect() {
  const [formStep, setFormStep] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  // const { data } = useGetRoutev1();
  // On first page load render, or on refresh. Reset step
  const navigateClearHistory = useCallback(() => {
    navigate('.', { replace: true, state: { formStep: 0 } });
    setFormStep(0);
  }, [navigate]);
  useEffect(() => {
    // Clear history on page refresh (if wanted)
    navigateClearHistory();
  }, [navigateClearHistory]);

  useEffect(() => {
    const historyLocationStep = (location.state as LocationState)?.formStep;
    setFormStep(historyLocationStep);
  }, [location]);

  const handleNextStep = (step: number, path = '.') => {
    // if (step === 0 and formStep === 0) {}
    if (step !== formStep) {
      console.log('navigating as', step, formStep);
      navigate(path, { state: { formStep: step } });
    }
  };

  const res = [];
  res.push(<div>Heh</div>);

  /*
  [TODO]
  1. The path to handleNextStep could do slashes in the url like the metro - or not.
  2. Need the hook re-usable
  */
  return (
    <>
      <div>Route select toolio</div>
      <div>
        Location OWN
        {JSON.stringify(location)}
      </div>
      <div>
        We are on step:
        {formStep}
      </div>
      {formStep >= 0 && (
      <RouteSelectStep handleNextStep={handleNextStep} />
      )}
      {formStep >= 1 && (
      <>
        <div>Step 1</div>
        <button type="button" onClick={() => handleNextStep(2)}>
          Go to Next Step
        </button>
      </>
      )}
      {formStep >= 2 && (
      <>
        <div>Step 2</div>
        <button type="button" onClick={() => handleNextStep(3)}>
          Go to Next Step
        </button>
      </>
      )}
    </>
  );
}

export default RouteSelect;
