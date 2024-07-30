import React from 'react'
import './profile.css'
import { useAuthContext } from '../../context/AuthContext';

const Profile = () => {
    const {authUser} = useAuthContext();
    console.log(authUser);
  return (
    <div className='formCon'>
    <form class="form">
        <p class="title">Profile </p>
<div className='flex1' >
    
<div className="flex">
            <label>
                <span>Register Company Name</span>
                <input class="input" type="text" placeholder="" value={authUser?.companyName}
                />
            </label>
            <label>
                <span>Company Email ID</span>
                <input class="input" type="email" placeholder="" value={authUser?.email}
                />
            </label>
         <div className='picc'>
         <label>
                <span>Company Logo<span><p>(optional)</p></span></span>
               <img className='input img' src="" alt="" />
               
            </label>
         </div>
        </div>
        <div class="flex">


            <label className='bn'>
                <span>Brand Name<span><p>(optional)</p></span></span>
                <input class="input" type="text" placeholder=""
                 />
            </label>
            <label className='bn'>
                <span>Website <span><p>(optional)</p></span></span>
                <input class="input" type="text" placeholder=""
                />
            </label>
</div>
</div>
<div className='flex2'>
    
<div className="flex">
            <label>
                <span>Complete address</span>
                <input class="input add" type="text" placeholder=""  
                />
            </label>
            <label>
                <span>Pincode</span>
                <input class="input" type="email" placeholder="" 
                />
            </label>
        </div>
        <div class="flex">


            <label>
                <span>City</span>
                <input class="input" type="text" placeholder=""
                 />
            </label>
            <label>
                <span>State</span>
                <input class="input" type="text" placeholder="" 
                />
            </label>
            <label>
                <span>Country</span>
                <input class="input" type="text" placeholder="" 
                />
            </label>
</div>
</div>
        <button class="submit">Save</button>
    </form>
</div>
  )
}

export default Profile
