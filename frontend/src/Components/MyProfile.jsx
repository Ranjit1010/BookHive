import React, { useEffect, useState } from 'react'
import Header from './Header'
import './MyProfile.css'
import axios from 'axios'


export const MyProfile = () => {

    const [user,setuser] = useState({})

    useEffect(()=>{
        let url = 'http://localhost:5000/my-profile/'+localStorage.getItem('userId');
        axios.get(url)
        .then((res) => {
         console.log(res.data)
          if(res.data.user){
            setuser(res.data.user);
          }
        })
        .catch((err) => {
          alert("server error");
        });
    },[])


  return (
    <div>
    <Header />
    <h2 className='my-profile-heading'>USER PROFILE</h2>

    <div className="table-container">
        <table>
            <thead>
                <tr>
                    <th>USERNAME</th>
                    <th>EMAIL ID</th>
                    <th>MOBILE</th>
                    
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.mobile}</td>
                    
                </tr>
            </tbody>
        </table>
    </div>
</div>
  )
}
