import { Row, Table, Typography } from 'antd';
import { ColumnType } from 'antd/lib/table';
import useGetDepartureListv1 from '../hooks/useGetDepartureListv1';
import { Departure } from '../types/Api';

function DepartureListTable({
  routeId, directionId, placeCode,
}: any) {
  const { data, loading, error } = useGetDepartureListv1({ routeId, directionId, placeCode });
  const { stops, alerts, departures } = data;
  const { description: stopDescription, stop_id: stopId } = stops?.[0] ?? { description: 'Unavailable Stop Name', stop_id: 'Unavailable' };
  const dataSource = departures?.map((departureObj: Departure) => {
    const {
      trip_id: key,
      route_short_name: routeShortName,
      description: destination,
      departure_time: departureTime,
      departure_text: departureText,
    } = departureObj;
    return {
      key,
      routeShortName,
      destination,
      departureTime,
      departureText,
    };
  }) ?? [];

  const columns: ColumnType<any>[] = [
    {
      title: 'ROUTE',
      dataIndex: 'routeShortName',
      key: 'routeShortName',
    },
    {
      title: 'DESTINATION',
      dataIndex: 'destination',
      key: 'destination',
    },
    {
      title: 'DEPARTS',
      dataIndex: 'departureText',
      key: 'departureText',
      sorter: (a: any, b: any) => a.departureTime - b.departureTime,
      sortOrder: 'ascend',
      // sortDirections: ['ascend'],
    },
  ];

  return (
    <Row>
      <Typography.Title level={3}>
        {stopDescription}
        {' '}
        - Stop #:
        {' '}
        {stopId}
      </Typography.Title>
      <Table columns={columns} dataSource={dataSource} loading={loading} className="customTable" />
    </Row>
  );
}

export default DepartureListTable;
