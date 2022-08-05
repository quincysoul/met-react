import {
  Col, Row, Typography, Tabs,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Search from 'antd/lib/input/Search';
import DepartureListTable from './DepartureListTable';
import SelectDirection from './SelectDirection';
import SelectRoute from './SelectRoute';
import SelectPlace from './SelectPlace';
import SearchStop from './SearchStop';

const { Title } = Typography;
const { TabPane } = Tabs;

interface LocationState {
  formStep: number
}

function MetroApp() {
  const navigate = useNavigate();
  const location = useLocation();
  // mved from line 0 any bugs
  const [formStep, setFormStep] = useState(0);
  // Form state - controlled form component. Can change to formik or other controller.
  const [routeId, setRouteId] = useState<null | number>(null);
  const [directionId, setDirectionId] = useState<null | number>(null);
  const [placeCode, setPlaceCode] = useState<null | number>(null);

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
      navigate(path, { state: { formStep: step } });
    }
  };

  return (
    <>
      <div className="splashBus" />
      <Title level={3} style={{ width: '100%', display: 'block', textAlign: 'center' }}>
        Real-time Departures
      </Title>

      <Tabs type="card" style={{ width: '40%' }}>
        <TabPane tab="By route" key="1">
          <div className="selectRow">
            {formStep >= 0 && (
            <SelectRoute
              handleNextStep={() => handleNextStep(1)}
              setSelectedValue={setRouteId}
              className="selectRoute"
            />
            )}
          </div>
          <div className="selectRow">
            {formStep >= 1 && (
            <SelectDirection
              routeId={routeId}
              handleNextStep={() => handleNextStep(2)}
              setSelectedValue={setDirectionId}
              className="selectDirection"
            />
            )}
          </div>
          <div className="selectRow">
            {formStep >= 2 && (
            <SelectPlace
              routeId={routeId}
              directionId={directionId}
              handleNextStep={() => handleNextStep(3)}
              setSelectedValue={setPlaceCode}
              className="selectPlace"
            />
            )}
          </div>
          <div className="selectRow">
            {formStep >= 3 && (
            <DepartureListTable
              routeId={routeId}
              directionId={directionId}
              placeCode={placeCode}
              className="routeTable"
            />
            )}
          </div>

        </TabPane>
        <TabPane tab="By stop #" key="2" id="tab2">
          <SearchStop />
        </TabPane>
      </Tabs>
    </>
  );
}

export default MetroApp;
