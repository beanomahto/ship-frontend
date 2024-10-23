import React, { useState, useEffect } from 'react';
import pincodeData from '../../../utils/zones.json';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { message } from 'antd';
import { useWarehouseContext } from '../../../context/WarehouseContext';

const UpdateWarehouse = () => {
    const navigate = useNavigate();
    const { id } = useParams(); 
    console.log(id);
    const {warehouse,fetchWarehouse} = useWarehouseContext();
    const [inputs, setInputs] = useState({
        warehouseName:'',
        contactPerson: '',
        contactEmail: '',
        contactNumber: '',
        pincode: '',
        city: '',
        state: '',
        address: '',
        landmark: '',
        country: 'India',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchWarehouseData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/warehouses/getSingleWarehouse/${id}`,{
                    headers:{
                        Authorization:localStorage.getItem('token')
                    }
                });
                const data = await response.json();
                console.log(data);
                
                setInputs({
                    warehouseName: data?.warehouse?.warehouseName || '',
                    contactPerson: data?.warehouse?.contactPerson || '',
                    contactEmail: data?.warehouse?.contactEmail || '',
                    contactNumber: data?.warehouse?.contactNumber || '',
                    pincode: data?.warehouse?.pincode || '',
                    city: data?.warehouse?.city || '',
                    state: data?.warehouse?.state || '',
                    address: data?.warehouse?.address || '',
                    landmark: data?.warehouse?.landmark || '',
                    country: data?.warehouse?.country || 'India',
                });
            } catch (error) {
                console.error("Error fetching warehouse data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWarehouseData();
    }, [id]);

    const handlePincodeChange = (e) => {
        const enteredPincode = e.target.value;
        setInputs({ ...inputs, pincode: enteredPincode });

        const matchedData = pincodeData.find(item => item.Pincode.toString() === enteredPincode);
        if (matchedData) {
            setInputs({
                ...inputs,
                pincode: enteredPincode,
                city: matchedData.City,
                state: matchedData.StateName,
            });
        } else {
            setInputs({
                ...inputs,
                pincode: enteredPincode,
                city: '',
                state: '',
            });
        }
    };

    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/warehouses/updateWarehouse/${id}`, {
                method: 'PUT', 
                headers: {
                    Authorization:localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputs),
            });
console.log(response);

            if (response.ok) {
                navigate('/warehouse'); 
                fetchWarehouse()
            } else {
                message.error("Failed to update warehouse")
                console.error("Failed to update warehouse");
            }
        } catch (error) {
            console.error("Error updating warehouse:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <meta charSet='utf-8' />
                <meta name='keyword' content={""} />
                <title>Update Warehouse</title>
            </Helmet>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className='formCon'>
                    <form className="form" onSubmit={handleOrderSubmit}>
                        <p className="title">Update Warehouse</p>
                        <div className="flex">
                            
                            <label>
                    <input class="input" type="text" placeholder="" required 
                    value={inputs.warehouseName} 
                    onChange={(e) => setInputs({ ...inputs, warehouseName: e.target.value })} 
                    />
                    <span>Warehouse Name</span>
                </label>
                        </div>
                        <div className="flex">
                            
                            <label>
                                <input
                                    className="input"
                                    type="text"
                                    placeholder=""
                                    required
                                    value={inputs.contactPerson}
                                    onChange={(e) => setInputs({ ...inputs, contactPerson: e.target.value })}
                                />
                                <span>Contact Person</span>
                            </label>
                            <label>
    <input 
        class="input" 
        type="text" 
        placeholder="" 
        required 
        maxLength="10"
        value={inputs.contactNumber}
        onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,10}$/.test(value)) {
                setInputs({ ...inputs, contactNumber: value });
            }
        }}
    />
    <span>Contact Number</span>
</label>
                            <label>
                                <input
                                    className="input"
                                    type="email"
                                    placeholder=""
                                    required
                                    value={inputs.contactEmail}
                                    onChange={(e) => setInputs({ ...inputs, contactEmail: e.target.value })}
                                />
                                <span>Contact Email</span>
                            </label>
                        </div>
                        <div className="flex">
                            <label>
                                <input
                                    className="input"
                                    type="text"
                                    placeholder=""
                                    required
                                    value={inputs.address}
                                    onChange={(e) => setInputs({ ...inputs, address: e.target.value })}
                                />
                                <span>Complete Address</span>
                            </label>
                            <label>
                                <input
                                    className="input"
                                    type="text"
                                    placeholder=""
                                    required
                                    value={inputs.pincode}
                                    onChange={handlePincodeChange}
                                />
                                <span>Pin</span>
                            </label>
                            <label>
                                <input
                                    className="input"
                                    type="text"
                                    placeholder=""
                                    value={inputs.landmark}
                                    onChange={(e) => setInputs({ ...inputs, landmark: e.target.value })}
                                />
                                <span>Landmark</span>
                            </label>
                        </div>
                        <div className="flex">
                            <label>
                                <input
                                    className="input"
                                    type="text"
                                    placeholder=""
                                    value={inputs.city}
                                    onChange={(e) => setInputs({ ...inputs, city: e.target.value })}
                                />
                                <span>City</span>
                            </label>

                            <label>
                                <input
                                    className="input"
                                    type="text"
                                    placeholder=""
                                    value={inputs.state}
                                    onChange={(e) => setInputs({ ...inputs, state: e.target.value })}
                                />
                                <span>State</span>
                            </label>
                            <label>
                                <input
                                    className="input"
                                    type="text"
                                    value={inputs.country}
                                    // readOnly
                                />
                                <span>Country</span>
                            </label>
                        </div>
                        <button className="submit" type="submit">Submit</button>
                    </form>
                </div>
            )}
        </>
    );
};

export default UpdateWarehouse;
