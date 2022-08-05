import { Select } from 'antd';
import useGetDirectionsv1 from '../hooks/useGetDirectionsv1';
import { Direction } from '../types/Api';

const { Option } = Select;

function SelectDirection({ routeId, setSelectedValue, handleNextStep }: any) {
  const { data, loading, error } = useGetDirectionsv1({ routeId });
  const onChange = (value: any) => {
    setSelectedValue(value);
    handleNextStep();
  };
  return (
    <Select
      className="customSelect"
      size="large"
      showSearch
      loading={loading}
      disabled={loading || error}
      placeholder="Select route"
      optionFilterProp="children"
      onChange={onChange}
      filterOption={
            (input: any, option: any) => option
              .children.toLowerCase().includes(input.toLowerCase())
          }
    >
      options=
      {(data || []).map((element: Direction) => (
        <Option
          value={element.direction_id}
        >
          {element.direction_name}
        </Option>
      ))}
    </Select>
  );
}

export default SelectDirection;
