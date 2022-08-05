import { Select } from 'antd';
import useGetRouteListv1 from '../hooks/useGetRoutev1';
import { Route } from '../types/Api';

const { Option } = Select;

function SelectRoute({ setSelectedValue, handleNextStep }: any) {
  const { data, loading, error } = useGetRouteListv1();
  const onChange = (value: any) => {
    console.log('setSelectedValue', value);
    setSelectedValue(value);
    handleNextStep();
  };
  return (
    <Select
      data-cy="selectRoute"
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
      {(data || []).map((element: Route) => (
        <Option
          value={element.route_id}
        >
          {element.route_label}
        </Option>
      ))}
    </Select>
  );
}

export default SelectRoute;
