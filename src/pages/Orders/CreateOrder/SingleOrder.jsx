import React, { useState } from 'react'
import { Select } from 'antd'
import '../orders.css'
import useCreateSingleOrder from '../../../hooks/useCreateSingleOrder'
import pincodeData from '../../../utils/zones.json'
import { useOrderContext } from '../../../context/OrderContext'
import { useNavigate } from 'react-router-dom'

const SingleOrder = () => {
    const navigate = useNavigate()
    const [inputs, setInputs] = useState({
        customerName:'',
        customerEmail: '',
        customerPhone: '',
        orderId:'',
       pincode:'',
       city:'',
       state:'',
       productPrice:'',
       productName:'',
       address:'',
       landMark:'',
       quantity:'',
       sku:'',
       weight:'',
       length:'',
       breadth:'',
       height:'',
       paymentMethod:null

    })
    
    const handlePincodeChange = (e) => {
        const enteredPincode = e.target.value;
        setInputs({ ...inputs, pincode: enteredPincode });

        const matchedData = pincodeData.find(item => item.Pincode.toString() === enteredPincode);
        if (matchedData) {
            setInputs({
              ...inputs,
              pincode: enteredPincode,
              city: matchedData.City,
              state: matchedData.StateName
            });
          } else {
            setInputs({
              ...inputs,
              pincode: enteredPincode,
              city: '',
              state: ''
            });
          }
        };
console.log(inputs)
    const { loading, createSingleOrder } = useCreateSingleOrder();
    const { orders } = useOrderContext();
    console.log(orders);

    const handleOrderSubmit = async(e) => {	
        e.preventDefault();
		await createSingleOrder(inputs);
        // setInputs('')
        navigate('/orders')
    }

    return (
        <>
            <div className='formCon'>
                <form class="form" onSubmit={handleOrderSubmit}>
                    <p class="title">Create Single Product </p>

                    <div className="flex">
                        <label>
                            <input class="input" type="text" placeholder="" required 
                            value={inputs.customerName} 
                            onChange={(e) => setInputs({ ...inputs, customerName: e.target.value })} />
                            <span>Customer Name</span>
                        </label>
                        <label>
                            <input class="input" type="number" placeholder="" required 
                            value={inputs.customerPhone}
                            onChange={(e) => setInputs({ ...inputs, customerPhone: e.target.value })}
                            />
                            <span>Customer Mobile No.</span>
                        </label>
                        <label>
                            <input class="input" type="email" placeholder="" required 
                            value={inputs.customerEmail}
                            onChange={(e) => setInputs({ ...inputs, customerEmail: e.target.value })}
                            />
                            <span>Customer Email</span>
                        </label>
                    </div>
                    <div class="flex">


                        <label>
                            <input class="input" type="text" placeholder="" required
                            value={inputs.address}
                            onChange={(e) => setInputs({ ...inputs, address: e.target.value })}
                             />
                            <span>Customer Full Address</span>
                        </label>
                        <label>
                            <input class="input" type="text" placeholder="" required 
                            value={inputs.pincode}
                            onChange={handlePincodeChange}
                            />
                            <span>Pin</span>
                        </label>
                        <label>
                            <input class="input" type="text" placeholder="" 
                            value={inputs.landMark}
                            onChange={(e) => setInputs({ ...inputs, landMark: e.target.value })}
                            />
                            <span>Landmark</span>
                        </label>
                    </div>
                    <div class="flex">
                        <label>
                            <input class="input" type="text" placeholder=""  
                            value={inputs.city}
                            // onChange={(e) => setInputs({ ...inputs, city: e.target.value })}
                            />
                            <span>City</span>
                        </label>

                        <label>
                            <input class="input" type="text" placeholder=""  
                            value={inputs.state}
                            // readOnly
                            // onChange={(e) => setInputs({ ...inputs, state: e.target.value })}
                            />
                            <span>State</span>
                        </label>
                        <label>
                            <input class="input" type="text" placeholder="" required 
                            value={inputs.productName}
                            onChange={(e) => setInputs({ ...inputs, productName: e.target.value })}
                            />
                            <span>Product name</span>
                        </label>
                    </div>
                    <div class="flex">

                        <label>
                            <input class="input" type="number" placeholder="" required
                            value={inputs.quantity}
                            onChange={(e) => setInputs({ ...inputs, quantity: e.target.value })}
                             />
                            <span>Quantity</span>
                        </label>
                        <label>
                            <input class="input" type="number" placeholder="" required 
                            value={inputs.productPrice}
                            onChange={(e) => setInputs({ ...inputs, productPrice: e.target.value })}
                             />
                            <span>Product Price</span>
                        </label>

                        <label>
                            <input class="input" type="text" placeholder="" required
                            value={inputs.sku}
                            onChange={(e) => setInputs({ ...inputs, sku: e.target.value })}
                             />
                            <span>SKU</span>
                        </label>
                    </div>
                    <div class="flex">
                        <label>
                            <input class="input" type="number" placeholder="" required 
                            value={inputs.orderId}
                            onChange={(e) => setInputs({ ...inputs, orderId: e.target.value })}
                            />
                            <span>Order ID</span>
                        </label>

                        <label>
                            <input class="input" type="number" placeholder="" required 
                            value={inputs.breadth}
                            onChange={(e) => setInputs({ ...inputs, breadth: e.target.value })}
                             />
                            <span>Breadth</span>
                        </label>
                        <label>
                            <input class="input" type="number" placeholder="" required 
                            value={inputs.length}
                            onChange={(e) => setInputs({ ...inputs, length: e.target.value })}
                            />
                            <span>Length</span>
                        </label>
                    </div>
                    <div class="flex">

                        <label>
                            <input class="input" type="number" placeholder="" required 
                            value={inputs.weight}
                            onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
                            />
                            <span>Weight in grm</span>
                        </label>
                        <label>
                            <input class="input" type="number" placeholder="" required 
                            value={inputs.height}
                            onChange={(e) => setInputs({ ...inputs, height: e.target.value })}
                            />
                            <span>Height</span>
                        </label>
                        <div className="paymentSelect" style={{
                        }}  >
                            <Select placeholder='Select Payment Method' 
                            value={inputs.paymentMethod} 
                            onChange={(e) => setInputs({ ...inputs, paymentMethod: e })}
                            options={[
                                { value: 'COD', label: 'Cash on delivery' },
                                { value: 'prepaid', label: 'prepaid' },
                            ]}
                            >

                            </Select>
                        </div>
                    </div>
                    <button class="submit">Submit</button>
                </form>
            </div>
        </>
    )
}
{/* <Button htmlType='submit' type='primary' style={{
                    marginTop:'1rem',
                    marginLeft:'50%',
                    fontSize:'1rem'
                }} >Submit</Button> */}
export default SingleOrder
