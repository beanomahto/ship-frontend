import React, { useEffect, useState } from 'react';
import { Button, Tabs, Modal, Popover, message } from 'antd';
import { Link } from 'react-router-dom';
import { useOrderContext } from '../../context/OrderContext';
import BulkOrderUploadModal from './BulkOrder/BulkOrder';
import BulkOrderDimension from './BulkOrder/BulkDimension';
import ShipNowModel from './ShipNow/ShipNowModel';
import NewOrderComponent from './NewOrderComponent';
import ShipOrderComponent from './ShipOrderComponent';
import * as XLSX from 'xlsx';
import { DownloadOutlined } from '@ant-design/icons';
import AllOrderComponent from './AllOrderComponent';
import axios from 'axios';
import useShipNowCost from '../../hooks/useShipNowCost';
import { useWarehouseContext } from '../../context/WarehouseContext';
import useCreateShipment from '../../hooks/useCreateShipment';
import LabelGenerator from './LabelGenerator/LabelGenerator';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import moment from 'moment';
const { TabPane } = Tabs;

const Orders = () => {
  const { shipNowCost } = useShipNowCost();
  const { warehouse } = useWarehouseContext();
  const [deliveryCosts, setDeliveryCosts] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const { orders, setOrders, fetchOrders } = useOrderContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleBD, setModalVisibleBD] = useState(false);
  const [modalVisibleShipNow, setModalVisibleShipNow] = useState(false);
  const [selectedOrderData, setSelectedOrderData] = useState([]);
  const [currentTab, setCurrentTab] = useState('tab1');
  console.log(orders);
console.log(selectedOrderData);
// const [shippingCosts, setShippingCosts] = useState([]);
  const showModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  const showModalBD = () => setModalVisibleBD(true);
  const closeModalBD = () => setModalVisibleBD(false);
  const showModalShipNow = () => setModalVisibleShipNow(true);
  const closeModalShipNow = () => setModalVisibleShipNow(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [currentDeliveryCost, setCurrentDeliveryCost] = useState(null);
  const {shipOrder,error} = useCreateShipment()
  const start = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://backend.shiphere.in/api/integration/syncButton', {
        headers: {
            Authorization: localStorage.getItem('token'),
        },
    });
      if (response.ok) {
        const result = await response.json();
        console.log('Sync successful', result);
        message.success('Sync successful');
      } else {
        console.error('Sync failed', response.statusText);
      }
    } catch (error) {
      console.error('Sync error', error);
    } finally {
      setSelectedRowKeys([]);
      setLoading(false);
    }
  };


  const onSelectChange = (newSelectedRowKeys) => {
    console.log(newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
    const selectedData = newSelectedRowKeys.map(key => 
      orders.orders.find(order => order._id === key)
    );
    setSelectedOrderData(selectedData);
  };
  
  const handleShipNow = async (selectedRowKeys, selectedWarehouse, selectedDeliveryPartner) => {
    console.log(selectedRowKeys);
    console.log(selectedWarehouse);
    console.log(selectedDeliveryPartner);

    if (selectedRowKeys.length === 0) {
      message.warning('Please select at least one order to ship.');
      return;
    }

    message.loading({ content: 'Processing shipment...', key: 'processing', duration: 0 });

    try {
      const updatedOrders = [];

      for (const orderId of selectedRowKeys) {
        const order = orders?.orders.find((order) => order._id === orderId);
        if (!order) continue;

        let selectedCost;

        try {
          const costData = await shipNowCost(orderId, selectedWarehouse);
          console.log('Cost Data for Order:', costData);

          selectedCost = costData.cost.find(
            (cost) => cost.deliveryPartner === selectedDeliveryPartner.name
          )?.cost;

        } catch (error) {
          console.error('Error in shipOrder or shipNowCost:', error);
          message.error('Failed to calculate shipping cost or ship order. Please try again.');
          continue;
        }

        try {
          console.log('Calling shipOrder with222:', { orderId, selectedWarehouse, selectedDeliveryPartner });
          await shipOrder(orderId, selectedWarehouse, selectedDeliveryPartner.name);

          console.log('Order shipped:', orderId);
          message.success('AWB generated');
        } catch (error) {
          console.log('Error in shipping with this partner:', error);
          message.error('Error in shipping with this partner');
          continue;
        }

        if (selectedCost === undefined) {
          message.error(`No cost found for delivery partner for order ${orderId}.`);
        }

        await fetch(`https://backend.shiphere.in/api/orders/updateOrderStatus/${orderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
          body: JSON.stringify({
            status: 'Shipped',
            shippingCost: selectedCost,
          }),
        });

        const walletRequestBody = {
          debit: selectedCost,
          userId: order.seller._id,
          remark: `Shipping charge for order ${order.orderId}`,
          orderId: order._id,
        };
        console.log(walletRequestBody);

        await fetch(`https://backend.shiphere.in/api/transactions/decreaseAmount`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
          body: JSON.stringify(walletRequestBody),
        });

        updatedOrders.push({ ...order, status: 'Shipped' });
      }

      const newOrdersCopy = orders.orders.filter((order) => !selectedRowKeys.includes(order._id));
      setOrders({
        orders: newOrdersCopy.concat(updatedOrders),
      });

      message.success({ content: 'Orders shipped successfully!', key: 'processing' });

    } catch (error) {
      console.error('Error processing shipment:', error);
      message.error({ content: 'Failed to process the shipment. Please try again.', key: 'processing' });
    } finally {
      setSelectedRowKeys([]);
      closeModalShipNow();
    }
  };

  
const exportToExcel = () => {
  const ordersToExport = selectedRowKeys.length > 0
    ? orders.orders.filter(order => selectedRowKeys.includes(order._id))
    : orders.orders;

  if (ordersToExport.length === 0) {
    message.warning('No orders available to export.');
    return;
  }

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(ordersToExport);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
  XLSX.writeFile(workbook, 'Orders.xlsx');
};

  const dataSourceWithKeys = orders?.orders?.map((order) => ({
    ...order,
    key: order._id,
    order:order
  })) || [];

  console.log(orders);

  // const dataSourceShipOrdersWithKeys = orders?.shipOrders?.map((order, index) => ({
  //   ...order,
  //   key: order._id,
  // })) || [];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    // onSelect: showModalShipNow,
  };
console.log(rowSelection);
const hasSelected = selectedRowKeys.length > 1;
console.log(dataSourceWithKeys);

const newOrdersAmt = dataSourceWithKeys?.filter(order => order.status === 'New' || order.status === 'Cancelled');
const shipOrdersAmt = dataSourceWithKeys?.filter(order => order.status === 'Shipped');
const inTransitOrdersAmt = dataSourceWithKeys?.filter(order => order.status === 'InTransit');

  const tabsData = [
    {
      key: 'tab1',
      tab: `New Orders (${newOrdersAmt?.length})`,
      Component: NewOrderComponent,
      dataSource: dataSourceWithKeys,
    },
    {
      key: 'tab2',
      tab: `Ship Orders (${shipOrdersAmt?.length})`,
      Component: ShipOrderComponent,
      dataSource: dataSourceWithKeys,
    },
    {
      key: 'tab3',
      tab: `In Transit (${inTransitOrdersAmt?.length})`,
      Component: NewOrderComponent,
      dataSource: [],
    },
    {
      key: 'tab4',
      tab: `All Orders (${dataSourceWithKeys?.length})`,
      Component: AllOrderComponent,
      dataSource: dataSourceWithKeys
    },
  ];

  console.log(tabsData);
  console.log(selectedRowKeys);
  
  const cancelShipment = async () => {
    if (selectedRowKeys.length === 0) {
        message.error('No orders selected');
        return;
    }

    const token = localStorage.getItem('token');
    try {
        const cancelRequests = selectedRowKeys.map(orderId =>
            axios.put(`https://backend.shiphere.in/api/orders/updateOrderStatus/${orderId}`, {
                status: 'Cancelled'
            }, {
                headers: {
                    Authorization: `${token}`
                }
            })
        );

        const cancelResponses = await Promise.all(cancelRequests);

        const allCancelSuccess = cancelResponses.every(response => response.status === 201);

        if (allCancelSuccess) {
            const walletRequests = selectedOrderData.map(order => {
                const walletRequestBody = {
                    userId: order.seller._id,
                    credit: order.shippingCost,
                    remark: `Credit charges for order ${order.orderId}`,
                };
                return axios.post(`https://backend.shiphere.in/api/transactions/increaseAmount`, walletRequestBody, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
            });

            const walletResponses = await Promise.all(walletRequests);

            const walletSuccess = walletResponses.every(response => response.status === 200);

            if (walletSuccess) {
                message.success('Orders cancelled and amounts updated successfully');
            } else {
                message.error('Failed to update some amounts');
            }

            fetchOrders();
            setSelectedRowKeys([]);
        } else {
            message.error('Failed to cancel some orders');
        }
    } catch (error) {
        console.log('Error:', error.response ? error.response.data : error.message);
        message.error('Failed to cancel orders');
    }
};

  useEffect(() => {
    const fetchDeliveryCost = async () => {
      if (selectedOrderId) {
        setModalLoading(true); 
        const costResponse = await shipNowCost(selectedOrderId, warehouse?.warehouses?.[0]?._id);
        if (costResponse.success) {
          setDeliveryCosts(costResponse.cost || []);
        } else {
          alert(costResponse.error || 'Failed to fetch delivery cost');
        }
        setModalLoading(false); 
      }
    };
    fetchDeliveryCost();
  }, [selectedOrderId, warehouse]);
  console.log(selectedRowKeys);
  
  const downloadMultipleLabels = async () => {
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: [4, 6],
    });

    for (const orderId of selectedRowKeys) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`https://backend.shiphere.in/api/shipping/getlabel/${orderId}`, {
                headers: {
                    Authorization: `${token}`,
                },
            });

            const labelData = response.data;
            const labelContainer = document.createElement('div');
            labelContainer.style.position = 'absolute';
            labelContainer.style.top = '-9999px';
            document.body.appendChild(labelContainer);
console.log(labelData);

            const logoBase64 = await getBase64ImageFromUrl(labelData.logoUrl);
            const labelHtml = `
                 <style>
          .label-container {
            font-weight: bold;
          }
          .label-section {
            margin-bottom: 0.5rem;
          }
          .label-section img {
            width: 11rem;
          }
          .label-section p {
            margin: 0;
          }
            p{
             font-weight: 500;
            }
          .label-section div {
            margin-bottom: 0.5rem;
          }
        </style>
                <div class="label-container">
                    <h1 style="text-align: center;">Shipping Label</h1>
                    <p><strong>Order Id:-</strong> ${labelData?.orderId}</p>
                    <div style="${labelData.logoUrl ? 'display: flex;' : ''}">
                        <div class="labelSection">
                            <img style="width: 11rem;" src="data:image/png;base64,${labelData.barcode}" alt="Barcode" />
                            <p>${labelData.shippingPartner}</p>
                        </div>
                    </div>
                    <div class="labelSection">
                        <p><strong>Ship To:</strong></p>
                        <p><strong>${labelData.customerName}</strong></p>
                        <p>${labelData?.address?.address} ${labelData?.address?.city} ${labelData?.returnWarehouse?.city} ${labelData?.returnWarehouse?.state}</p>
                        <p><strong>PIN:</strong> ${labelData.address?.pincode}</p>
                    </div>
                    <div style="display: flex;">
                        <div class="labelSection" style="width: 16rem;">
                            <p><strong>${labelData.paymentType}</strong></p>
                            <p><strong>Product name</strong></p>
                            <p>${labelData.productName}</p>
                        </div>
                        <div class="labelSection" style="width: 10rem;">
                            <p><strong>${labelData.paymentType}</strong></p>
                            <p><strong>INR</strong></p>
                            <p>${labelData.amount}</p>
                        </div>
                        <div class="labelSection" style="width: 12rem;">
                            <p><strong>Price Total</strong></p>
                            <p>INR ${labelData.amount}</p>
                            <p>Surface</p>
                        </div>
                    </div>
                    <div style="display: flex;">
                        <div class="labelSection" style="width: 12rem;">
                            <p><strong>Product (QTY)</strong></p>
                        </div>
                        <div class="labelSection" style="width: 12rem;">
                            <p>box (${labelData?.productDetail?.quantity})</p>
                        </div>
                    </div>
                    <div style="display: flex;">
                        <div class="labelSection" style="width: 12rem;">
                            <p><strong>Total INR</strong></p>
                        </div>
                        <div class="labelSection" style="width: 12rem;">
                            <p>${labelData.amount}</p>
                        </div>
                    </div>
                    <div class="labelSection">
                        <p><strong>Return Address:</strong></p>
                        <p>${labelData?.pickupAddress?.address} ${labelData?.pickupAddress?.state} ${labelData?.pickupAddress?.city} ${labelData?.pickupAddress?.country}</p>
                    </div>
                    <p>Powered by <strong>ShipHere</strong></p>
                </div>
            `;

            labelContainer.innerHTML = labelHtml;

            const canvas = await html2canvas(labelContainer);
            const imgData = canvas.toDataURL('image/png');

            pdf.addImage(imgData, 'PNG', 0, 0, 4, 6);

            if (orderId !== selectedRowKeys[selectedRowKeys.length - 1]) {
                pdf.addPage();
            }

            document.body.removeChild(labelContainer);
        } catch (error) {
            console.error('Error generating label:', error.message);
            alert(`Error generating label for order ID ${orderId}`);
        }
    }

    pdf.save('labels.pdf');
};

const getBase64ImageFromUrl = async (imageUrl) => {
    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const base64 = btoa(
            new Uint8Array(response.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
            )
        );
        return `data:image/png;base64,${base64}`;
    } catch (error) {
        console.error('Error converting image to base64:', error.message);
        return null;
    }
};

const downloadInvoices = async () => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const promises = selectedRowKeys.map(orderId =>
    fetch(`https://backend.shiphere.in/api/shipping/getinvoice/${orderId}`, {
      headers: {
        Authorization: `${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        const invoiceData = data.invoiceData;
        console.log(invoiceData);
        
        // Create a hidden div to render the invoice
        const invoiceDiv = document.createElement('div');
        invoiceDiv.style.position = 'absolute';
        invoiceDiv.style.left = '-9999px';
        invoiceDiv.style.width = '595.28pt'; // A4 width in points
        invoiceDiv.style.minHeight = '841.89pt'; // A4 height in points
        invoiceDiv.style.padding = '2rem';
        invoiceDiv.style.fontFamily = 'Arial, sans-serif';
        invoiceDiv.style.boxSizing = 'border-box';

        invoiceDiv.innerHTML = `
          <div class="invoice-container" style="padding: 2rem; font-family: Arial, sans-serif;">
            <div class="invoice-section">
              <div class="invoice-header">
                <div class="sold-by" style="padding: 12px; border: 1px solid #000000;">
                  <h2>Sold By:</h2>
                  <p style="font-style: italic;">${invoiceData?.sellerName}</p>
                  <p style="font-style: italic;">${invoiceData?.sellerAddress}</p>
                  <p style="font-style: italic;">GSTIN No.: ${invoiceData?.sellerGSTIN}</p>
                </div>
                <div class="delivered-to" style="padding: 12px; border: 1px solid #000000;">
                  <h2>Delivered To:</h2>
                  <p style="font-style: italic;">${invoiceData?.customerName}</p>
                  <p style="font-style: italic;">${invoiceData?.customerAddress}</p>
                </div>
              </div>
              <div class="invoice-details" style="padding: 12px; border: 1px solid #000000;">
                <p style="font-style: italic;"><strong>Invoice No.: </strong>${invoiceData.invoiceNumber}</p>
                <p style="font-style: italic;"><strong>Invoice Date: </strong>${invoiceData.invoiceDate}</p>
                <p style="font-style: italic;"><strong>Order Date: </strong>${invoiceData.orderDate}</p>
              </div>
            </div>
            <div class="invoice-items" style="border: 1px solid #000000; width: 100%; border-collapse: collapse;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="border: 1px solid #ddd; padding: 5px; background-color: #f4f4f4;">Qty</th>
                    <th style="border: 1px solid #ddd; padding: 5px; background-color: #f4f4f4;">Dimensions</th>
                    <th style="border: 1px solid #ddd; padding: 5px; background-color: #f4f4f4;">Unit Price</th>
                    <th style="border: 1px solid #ddd; padding: 5px; background-color: #f4f4f4;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 5px;">${invoiceData?.quantity}</td>
                    <td style="border: 1px solid #ddd; padding: 5px;">${invoiceData?.dimensions.length}x${invoiceData?.dimensions.breadth}x${invoiceData?.dimensions.height}</td>
                    <td style="border: 1px solid #ddd; padding: 5px;">${invoiceData?.unitPrice}</td>
                    <td style="border: 1px solid #ddd; padding: 5px;">${invoiceData?.totalPrice}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="invoice-footer" style="padding: 7px; border: 1px solid #000000;">
              <p style="font-style: italic;">Net Amount Payable (In Words): <strong>${invoiceData.netAmountInWords}</strong></p>
            </div>
          </div>
        `;

        document.body.appendChild(invoiceDiv);

        return html2canvas(invoiceDiv, { scale: 2 }).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 595.28; // A4 width in points
          const pageHeight = 841.89; // A4 height in points
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          let heightLeft = imgHeight;
          let position = 0;

          if (orderId !== selectedRowKeys[0]) {
            pdf.addPage(); // Add a new page for each invoice if needed
          }
          
          // Add image to the PDF and manage page breaks
          while (heightLeft > 0) {
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, Math.min(imgHeight, pageHeight));
            heightLeft -= pageHeight;
            position = heightLeft > 0 ? -pageHeight : 0;
            if (heightLeft > 0) {
              pdf.addPage();
            }
          }

          document.body.removeChild(invoiceDiv);
        });
      })
      .catch(error => {
        console.error("Error generating invoice:", error);
      })
  );

  Promise.all(promises).then(() => {
    pdf.save('all_invoices.pdf');
  });
};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }} className="addorder">
       {currentTab === 'tab1' &&  <Button type="primary" style={{ alignSelf: 'flex-start', borderRadius:'34px',fontFamily:'Poppins', fontSize:'1rem', fontWeight:'500' }} onClick={start} loading={loading}>Sync</Button>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4rem', fontSize:'2rem',fontFamily:'Poppins' }}>
          {currentTab === 'tab1' && <Button style={{borderRadius:'34px'}} disabled={!hasSelected} onClick={showModalShipNow}>Ship Now</Button>}

{
  <div>
  <div style={{ display: 'flex', justifyContent: 'space-between',flexDirection:'row', gap: '60rem' }}>
  <Button type="primary" shape="round" onClick={exportToExcel} icon={<DownloadOutlined />} style={{minWidth:'9rem',}} size='middle'>
            Download
          </Button>
  {
      currentTab === 'tab2' &&   <div style={{display:'flex',justifyContent:'space-evenly', gap:'3rem'}} >
        <Button
        disabled={selectedRowKeys.length === 0}
        style={{ borderColor: 'black', borderRadius: '50px' }}
        onClick={downloadMultipleLabels}
      >
        Shipping Label
      </Button>
      {/* <Button disabled={selectedRowKeys.length === 0} style={{ borderColor: 'gray', borderRadius: '50px' }} onClick={downloadInvoices}>
                    Invoice
                  </Button> */}
                  <Button disabled={selectedRowKeys.length !== 1} style={{ borderColor: 'gray', borderRadius: '50px' }}><Link to={`/shipping/getInvoice/${selectedRowKeys[0]}`} >Invoice</Link></Button>
            <Button disabled={selectedRowKeys.length === 0} style={{ borderColor: 'red', borderRadius:'50px' }} onClick={cancelShipment} >Cancel Shipment</Button>
        </div>
  }
        </div>
  </div>
}
          {(currentTab === 'tab1') && (
            <>
              <Button style={{
                backgroundColor: '#668fa0',
                color: 'white',
                border: '2px solid #a5ffe7',
                boxShadow: 'inherit',
                borderRadius: '35px',
                padding: '10px 20px',
                // fontSize: '16px',
                transition: 'background-color 0.3s',
                fontSize:'1rem', fontWeight:'500'
              }} >
                <Link to='singleorder'>Single Order</Link>
              </Button>
              <Popover
                trigger={'click'}
                placement="leftTop"
                title={
                  <div style={{
                    display: 'flex',
                    flexDirection: "column",
                    margin: '1rem',
                    gap: '1rem'
                  }}>
                    <Button style={{borderRadius:'35px', fontFamily:'Poppins'}} onClick={showModal}>Bulk Orders</Button>
                    <Button style={{borderRadius:'35px', fontFamily:'Poppins'}} onClick={showModalBD}>Bulk Dimensions</Button>
                  </div>
                }
              >
                <Button style={{borderRadius:'35px', fontFamily:'Poppins'}}>Bulk Actions</Button>
              </Popover>
            </>
          )}
       
          <BulkOrderUploadModal visible={modalVisible} onClose={closeModal} />
          <BulkOrderDimension visible={modalVisibleBD} onClose={closeModalBD} />
          <ShipNowModel hasSelected={hasSelected} selectedRowKeys={selectedRowKeys} visible={modalVisibleShipNow} onClose={closeModalShipNow} onShipNow={handleShipNow} />
        </div>
      </div>
      <Tabs defaultActiveKey='tab1' size='large' className='tabs' onChange={setCurrentTab}>
        {tabsData.map(tab => (
          <TabPane key={tab.key} tab={tab.tab}>
            {tab.Component ? (
              <tab.Component
                dataSource={tab.dataSource}
                // rowSelection={tab.key === 'tab1' ? rowSelection : null}
                rowSelection={rowSelection}
                fetchOrders={fetchOrders}
                loading={loading}
                warehouse={warehouse}
                setModalLoading={setModalLoading}
                modalLoading={modalLoading}
                deliveryCosts={deliveryCosts}
                setDeliveryCosts={setDeliveryCosts}
                setSelectedOrderId={setSelectedOrderId}
                selectedOrderId={selectedOrderId}
                setCurrentDeliveryCost={setCurrentDeliveryCost}
                currentDeliveryCost={currentDeliveryCost}
              />
            ) : (
              <span>No component for this tab</span>
            )}
            <span style={{ marginLeft: 8 }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default Orders;
