import { Tooltip } from 'antd';
import Search from 'antd/lib/input/Search';
import { useState } from 'react';
import StopDepartureListTable from './StopDepartureListTable';

function SearchStop() {
  const [stopId, setStopId] = useState<null | number>(null);
  const [value, setValue] = useState('');
  const formatNumber = (v: number) => new Intl.NumberFormat().format(v);

  const handleChange = (e: any) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
      setValue(inputValue);
    }
  };

  const handleBlur = () => {
    let valueTemp = value;
    if (value.charAt(value.length - 1) === '.' || value === '-') {
      valueTemp = value.slice(0, -1);
    }
    handleChange(valueTemp.replace(/0*(\d+)/, '$1'));
  };

  const title = value ? (
    <span className="numeric-input-title">{value !== '-' ? formatNumber(Number(value)) : '-'}</span>
  ) : (
    'Input stop number'
  );

  const searchStopNumber = (v: string) => {
    setStopId(parseInt(v, 10));
  };

  return (
    <>
      <Search
        data-cy="searchStop"
        placeholder="Enter stop number"
        onSearch={searchStopNumber}
        onBlur={handleBlur}
        enterButton
        size="large"
      />
      {stopId ? <StopDepartureListTable stopId={stopId} /> : null}

    </>
  );
}

export default SearchStop;
