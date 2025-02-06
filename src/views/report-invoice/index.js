import {
  Card,
  Button,
  Col,
  Row,
  Space,
  Typography,
  Table,
  Tag,
  DatePicker,
  Spin,
  Menu,
  Dropdown,
} from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { addMenu, disableRefetch } from '../../redux/slices/menu';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import ReportChart from '../../components/report/chart';
import moment from 'moment';
import { ReportContext } from '../../context/report';
import FilterColumns from '../../components/filter-column';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  fetchOrderProduct,
  fetchOrderProductChart,
  fetchReportForInvoice,
} from '../../redux/slices/report/order';
import useDidUpdate from '../../helpers/useDidUpdate';
import numberToPrice from '../../helpers/numberToPrice';
import { DebounceSelect } from 'components/search';
import shopService from 'services/restaurant';
import { jsPDF } from "jspdf";
import logo from './logo.png';  // Assuming you have a logo image in the project folder

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

const ReportInvoice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { date_from, date_to, by_time, chart, handleChart, handleDateRange } =
    useContext(ReportContext);
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);


  const {
    loading,
    chartData: reportData,
    productList: reportProducts,
  } = useSelector((state) => state.orderReport, shallowEqual);
  const [invoice, setInvoice] = useState(null);


  const { invoiceData } = useSelector((state) => state.orderReport, shallowEqual);
  console.log(invoiceData);



  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );
  const [selectedShop, setSelectedShop] = useState();

  const [columns, setColumns] = useState([
    {
      title: 'Order #',
      dataIndex: 'id',
      key: 'id',
      is_show: true,
      render: (_, data) => <a onClick={() => goToShow(data)}>#{data.id}</a>,
    },
    {
      title: 'Status',
      dataIndex: 'items_sold',
      key: 'items_sold',
      is_show: true,
      render: (_, row) => <Tag>{row.status}</Tag>,
    },
    {
      title: 'Customer',
      dataIndex: 'user_firstname',
      key: 'user_firstname',
      is_show: true,
      render: (_, data) => <>{`${data.firstname} ${data.lastname}`}</>,
    },
    {
      title: 'Customer type',
      key: 'user_active',
      dataIndex: 'user_active',
      is_show: true,
      render: (_, data) => {
        const status = Boolean(data.active);
        return (
          <Tag color={status ? 'green' : 'red'} key={data.id}>
            {status ? 'Active' : 'Inactive'}
          </Tag>
        );
      },
    },
    {
      title: 'Product(s)',
      key: 'category',
      dataIndex: 'category',
      is_show: true,
      render: (_, data) => {
        if (data.products?.length > 1) {
          return (
            <>
              <p>{data.products[0]}</p>
  
              <Dropdown
                overlay={
                  <Menu>
                    {data.products
                      ?.slice(1, data.products.length)
                      .map((item, key) => (
                        <Menu.Item key={key}>{item}</Menu.Item>
                      ))}
                  </Menu>
                }
              >
                <Tag style={{ cursor: 'pointer' }}>{`+ ${
                  data.products?.length - 1
                } more`}</Tag>
              </Dropdown>
            </>
          );
        } else {
          return <>{data.products[0]}</>;
        }
      },
    },
    {
      title: 'Item sold',
      key: 'item_sold',
      dataIndex: 'item_sold',
      sorter: (a, b) => Number(a.quantity) - Number(b.quantity),
      is_show: true,
      render: (_, data) => {
        return Number(data.quantity);
      },
    },
    {
      title: 'Net sales',
      key: 'price',
      dataIndex: 'price',
      is_show: true,
      sorter: (a, b) => a.price - b.price,
      render: (_, data) => {
        return (
          <>
            {numberToPrice(
              data.price,
              defaultCurrency?.symbol,
              defaultCurrency?.position,
            )}
          </>
        );
      },
    },
    // Add this commission_fee column
    {
      title: 'Commission Fee',
      key: 'commission_fee',
      dataIndex: 'commission_fee',
      is_show: true,
      render: (_, data) => {
        return (
          <>
            {numberToPrice(
              data.commission_fee,
              defaultCurrency?.symbol,
              defaultCurrency?.position,
            )}
          </>
        );
      },
    }
  ]);
  
  

  const performance = [
    {
      label: 'Item sold',
      value: 'quantity',
      price: false,
      qty: 'quantity',
    },
    {
      label: 'Net sales',
      value: 'price',
      price: true,
      qty: 'price',
    },
    {
      label: 'Commission',
      value: 'commission_fee',
      price: true,
      qty: 'commission_fee',
    },
    {
      label: 'Avg Order price',
      value: 'avg_price',
      price: true,
      qty: 'avg_price',
    },
    {
      label: 'Orders',
      value: 'count',
      price: false,
      qty: 'count',
    },
  ];

  const goToShow = (row) => {
    dispatch(
      addMenu({
        url: `order/details/${row.id}`,
        id: 'order_details',
        name: t('order.details'),
      }),
    );
    navigate(`/order/details/${row.id}`);
  };

  const fetchReport = () => {
    const access_token = localStorage.getItem("token");
    // console.log("charttttt",selectedShop?.value, by_time);
    
    if (performance.find((item) => item.value === chart)) {
      const data = {
        date_from,
        date_to,
        type: by_time,
        chart,
        shop_id: selectedShop?.value,
      };
      dispatch(fetchOrderProductChart(data));
    }
  };
  const fetchInvoice = () => {
    if (performance.find((item) => item.value === chart)) {
      const data = {
        date_from,
        date_to,
        type: by_time,
        shop_id: selectedShop?.value,
      };
      // console.log("Dispatching fetchReportForInvoice with data:", data);
      dispatch(fetchReportForInvoice(data));
    }
  };
  const fetchProduct = (page, perPage) => {
    dispatch(
      fetchOrderProduct({
        date_from,
        date_to,
        by_time,
        chart,
        page,
        perPage,
        shop_id: selectedShop?.value,
      }),
    );
  };

  useEffect(() => {
    handleChart(performance[0].value);
    
  }, []);

  useEffect(() => {
    if (activeMenu.refetch) {
      fetchProduct();
      fetchReport();
      dispatch(disableRefetch(activeMenu));
    }
    fetchInvoice();
  }, [activeMenu.refetch, date_from, date_to, by_time, chart, selectedShop]);

  useDidUpdate(() => {
    fetchProduct();
    fetchInvoice();
    

  }, [date_to, by_time, chart, date_from, selectedShop?.value]);

  useDidUpdate(() => {
    fetchReport();
    fetchInvoice();
  }, [date_to, by_time, chart, date_from, selectedShop?.value]);

  useDidUpdate(() => {
    fetchInvoice();
  }, [date_to, by_time, date_from, selectedShop?.value]);

  useDidUpdate(() => {
    setInvoice(invoiceData);

  },[invoiceData]);

  const onChangePagination = (pagination) => {
    const { pageSize: perPage, current: page } = pagination;
    fetchProduct(page, perPage);
  };

  async function fetchUserShopList(search) {
    const params = { search, active: 1 };
    return shopService.get(params).then((res) =>
      res.data.map((item) => ({
        label: item.translation ? item.translation.title : 'no name',
        value: item.id,
      })),
    );
  }
  const generateInvoice = (data) => {
    if (!data) return;

    const doc = new jsPDF();

    // Add logo at the top-left corner
    doc.addImage(logo, 'PNG', 10, 10, 35, 25);  // (image source, format, x, y, width, height)

    // Title
    doc.setFontSize(18);
    doc.text("Restaurant Invoice", 14, 50);  // Adjusted Y position to avoid overlap with the logo

    // Invoice Number and Date
    doc.setFontSize(12);
    doc.text(`Date: ${moment().format('DD/MM/YYYY')}`, 14, 65);  // Adjusted Y position
    doc.text(`Period: ${moment(data.date_from).format('DD/MM/YYYY')} - ${moment(data.date_to).format('DD/MM/YYYY')}`, 14, 70);  // Adjusted Y position

    // Restaurant Info
    doc.text(`Restaurant Name: ${data.restaurant}`, 14, 80);  // Adjusted Y position
    doc.text(`Restaurant Address: ${data.address}`, 14, 85);  // Adjusted Y position

    // Summary
    doc.text("Summary", 14, 100);  // Adjusted Y position

    const totalRevenue = parseFloat(data.data.revenue).toFixed(2);
    doc.text(`Total Revenue: ${totalRevenue} DKK`, 14, 110);  // Adjusted Y position
    doc.text(`Total Orders: ${data.total_orders}`, 14, 115);  // Adjusted Y position
    doc.text(`Commission: ${data.commission_fee} DKK`, 14, 120);  // Adjusted Y position

    // Breakdown table
    doc.text("Breakdown", 14, 135);  // Adjusted Y position
    doc.text("Date", 14, 145);  // Adjusted Y position
    doc.text("Orders", 70, 145);  // Adjusted Y position
    doc.text("Revenue (DKK)", 120, 145);  // Adjusted Y position
    doc.text("Commission", 170, 145);  // Adjusted Y position

    const breakdown = data.breakdown || [];
    let yPosition = 150;  // Adjusted Y position for the breakdown items
    breakdown.forEach((item) => {
      doc.text(item.date, 14, yPosition);
      doc.text(item.orders ? item.orders.toString() : '', 70, yPosition);  // Check for undefined
      doc.text(item.revenue ? item.revenue.toString() : '', 120, yPosition);  // Check for undefined
      doc.text(item.commission_fee ? item.commission_fee.toString() : '', 170, yPosition);  // Check for undefined
      yPosition += 10;
    });

    const totalPayableFormatted = parseFloat(data.total_payable).toFixed(2);



    // Total Payable
    doc.text(`Total Payable to Restaurant: ${totalPayableFormatted} DKK`, 14, yPosition + 10);
    const currentDateTime = moment().format('YYYY-MM-DD_HH-mm-ss');


    // Save the PDF
    doc.save(`${data.restaurant}_Invoice_${currentDateTime}.pdf`);
};


  const handleGenerateInvoiceClick = () => {
    if (invoice) {
      generateInvoice(invoice); // Passing invoice data to the function
    }
  };

  return (
    <Spin size='large' spinning={loading}>
      <Row gutter={24} className='mb-3'>
        <Col span={12}>
          <Space size='large'>
            <RangePicker
              defaultValue={[moment(date_from), moment(date_to)]}
              onChange={handleDateRange}
            />
            <DebounceSelect
              style={{ width: '200px' }}
              value={selectedShop}
              onClear={() => setSelectedShop(undefined)}
              onSelect={(value) => setSelectedShop(value)}
              fetchOptions={fetchUserShopList}
              placeholder={t('select.shop')}
            />
          </Space>
        </Col>
          <Col span={12} className="d-flex justify-content-end">
          <Button type="primary" onClick={handleGenerateInvoiceClick}>
            {t('Download faktura')}
          </Button>
        </Col>
      </Row>
      <Row gutter={24} className='report-products'>
        {performance?.map((item, key) => (
          <Col
            span={6}
            key={item.label}
            onClick={() => handleChart(item.value)}
          >
            <Card className={chart === item.value && 'active'}>
              <Row className='mb-5'>
                <Col>
                  <Text>{item.label}</Text>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={18}>
                  <Title level={2}>
                    {!item.price
                      ? reportData[item.qty]
                      : numberToPrice(
                          reportData[item.qty],
                          defaultCurrency?.symbol,
                          defaultCurrency?.position,
                        )}
                  </Title>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
      <ReportChart reportData={reportData} chart_data='price_avg' />
      <Row gutter={24}>
        <Col span={24}>
          <Card>
            <Space className='d-flex justify-content-between'>
              <Text level={3}>Orders</Text>
              <Space className='d-flex justify-content-end'>
                <Tag color='geekblue'>{t('compare')}</Tag>
                <FilterColumns columns={columns} setColumns={setColumns} />
              </Space>
            </Space>

            <Table
              columns={columns?.filter((item) => item.is_show)}
              dataSource={reportProducts?.data}
              rowKey={(row) => row.id}
              loading={loading}
              pagination={{
                pageSize: reportProducts?.per_page,
                page: reportProducts?.current_page || 1,
                total: reportProducts?.total,
                defaultCurrent: 1,
              }}
              onChange={onChangePagination}
              scroll={{ x: 1200 }}
            />
          </Card>
        </Col>
      </Row>
    </Spin>
  );
};

export default ReportInvoice;
