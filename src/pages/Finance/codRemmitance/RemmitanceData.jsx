import { Button } from 'antd'
import React from 'react'

const RemmitanceData = () => {
    return (
        <div className='rbtncontainer'>
            <div type='default' className='rbtn rbtn1' >
            <span>Total Generated Remittance</span> 
            <p>Till date</p>
            <h4>Rs 69,708</h4>
            </div>
            <div type='default' className='rbtn rbtn2' >
            <span>Next Remittance</span> 
            <p>(2024-05-23)</p>
            <h4>Rs 69,708</h4>
            </div>
            <div type='default' className='rbtn rbtn3' >
            <span>Future Remittance</span> 
            <p>(2024-05-23)</p>
            <h4>--</h4>
            </div>
            <div type='default' className='rbtn rbtn4' >
            <span>Last Remittance</span> 
            <p>(2024-05-23)</p>
            <h4>Rs 69,708</h4>
            </div>
        </div>
    )
}

export default RemmitanceData
