import { Select } from 'antd';
import useGetPlaceListv1 from '../hooks/useGetPlacesv1';
import { Place } from '../types/Api';

const { Option } = Select;

function SelectPlace({
  routeId, directionId, setSelectedValue, handleNextStep,
}: any) {
  const { data, loading, error } = useGetPlaceListv1({ routeId, directionId });
  const onChange = (value: any) => {
    console.log('setSelectedValue', value);
    setSelectedValue(value);
    handleNextStep();
  };
  return (
    <Select
      data-cy="selectPlace"
      className="customSelect"
      size="large"
      showSearch
      loading={loading}
      disabled={loading || error}
      placeholder="Select stop"
      optionFilterProp="children"
      onChange={onChange}
      filterOption={
            (input: any, option: any) => option
              .children.toLowerCase().includes(input.toLowerCase())
          }
    >
      options=
      {(data || []).map((element: Place) => (
        <Option
          value={element.place_code}
        >
          {element.description}
        </Option>
      ))}
    </Select>
  );
}

export default SelectPlace;
