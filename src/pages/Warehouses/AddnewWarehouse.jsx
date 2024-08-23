import React, { useState } from 'react'
import pincodeData from '../../utils/zones.json'
import { Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import useAddWarehouse from '../../hooks/useAddWarehouse';
import { Helmet } from 'react-helmet';

const AddnewWarehouse = () => {
    const navigate = useNavigate()
    const [inputs, setInputs] = useState({
        contactPerson:'',
        contactEmail: '',
        contactNumber: '',
       pincode:'',
       city:'',
       state:'',
       address:'',
       landmark:'',
       country:'India'

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

    const { addWarehouse, loading } = useAddWarehouse();
    console.log(inputs);

 const handleOrderSubmit = async(e) => {	
            e.preventDefault();
            await addWarehouse(inputs)
            navigate('/warehouse')
            // setInputs('')
        }
  return (
   <>
     <Helmet>
                <meta charSet='utf-8' />
                <meta name='keyword' content={""} />
                <title>Add Warehouse</title>
            </Helmet>
   {
    loading ? '' :  <div >
    <div className='formCon'>
        <form class="form" onSubmit={handleOrderSubmit}>
            <p class="title">Create Warehouse</p>

            <div className="flex">
                <label>
                    <input class="input" type="text" placeholder="" required 
                    value={inputs.contactPerson} 
                    onChange={(e) => setInputs({ ...inputs, contactPerson: e.target.value })} 
                    />
                    <span>Contact Person</span>
                </label>
                <label>
                    <input class="input" type="number" placeholder="" required 
                    value={inputs.contactNumber}
                    onChange={(e) => setInputs({ ...inputs, contactNumber: e.target.value })}
                    />
                    <span>Contact Number</span>
                </label>
                <label>
                    <input class="input" type="email" placeholder="" required 
                    value={inputs.contactEmail}
                    onChange={(e) => setInputs({ ...inputs, contactEmail: e.target.value })}
                    />
                    <span>Contact Email</span>
                </label>
            </div>
            <div class="flex">
                <label>
                    <input class="input" type="text" placeholder="" required
                    value={inputs.address}
                    onChange={(e) => setInputs({ ...inputs, address: e.target.value })}
                     />
                    <span>Complete Address</span>
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
                    value={inputs.landmark}
                    onChange={(e) => setInputs({ ...inputs, landmark: e.target.value })}
                    />
                    <span>Landmark</span>
                </label>
            </div>
            <div class="flex">
                <label>
                    <input class="input" type="text" placeholder=""  
                    value={inputs.city}
                    onChange={(e) => setInputs({ ...inputs, city: e.target.value })}
                    />
                    <span>City</span>
                </label>

                <label>
                    <input class="input" type="text" placeholder=""  
                    value={inputs.state}
                    // readOnly
                    onChange={(e) => setInputs({ ...inputs, state: e.target.value })}
                    />
                    <span>State</span>
                </label>
                <label>
                    <input class="input" type="text" 
                    value={inputs.country}
                    // readOnly
                    // onChange={(e) => setInputs({ ...inputs, country: e.target.value })}
                    />
                    <span>Country</span>
                </label>
               </div>
            <button class="submit">Submit</button>
        </form>
    </div>

</div>
   }
   </>
  )
}

export default AddnewWarehouse
