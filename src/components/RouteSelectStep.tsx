import { Select } from 'antd';
import useGetRoutev1 from '../hooks/useGetRoutev1';
import { Route } from '../types/Api';

const { Option } = Select;

interface LocationState {
  formStep: number
}

function RouteSelectStep({ handleNextStep }: any) {
  const { data } = useGetRoutev1();
  const onChange = (value: any) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value: any) => {
    console.log('search:', value);
  };
  return (
    <>
      <div>Step 0</div>
      <Select
        showSearch
        placeholder="Select a person"
        optionFilterProp="children"
        onChange={onChange}
        onSearch={onSearch}
        filterOption={
            (input: any, option: any) => option.children.toLowerCase().includes(input.toLowerCase())
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
      <button type="button" onClick={() => handleNextStep(1)}>
        Go to Next Step
      </button>
    </>
  );
}

export default RouteSelectStep;
