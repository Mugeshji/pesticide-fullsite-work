import React, { useState, useEffect } from 'react';
import './user.css';
import axios from "axios";
import { Link } from "react-router-dom";

const User = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/users");
        setUsers(response.data);
      } catch (error) {
        console.log("Error while fetching data", error);
      }
    };
    fetchData();
  }, []);

  const deleteUser = async (userId) => {
    await axios
      .delete(`http://localhost:8000/api/delete/user/${userId}`)
      .then(() => {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div class="hero_area">
     
        <header class="header_section">
          <nav class="navbar navbar-expand-lg custom_nav-container ">
            <a class="navbar-brand" href="index.html">
              <span>
               Admin Page
              </span>
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class=""></span>
            </button>
    
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav  ">
                <li class="nav-item active">
    
                <Link to="/user" class="nav-link">All users<span class="sr-only">(current)</span></Link>
                  
                </li>
                <li class="nav-item">
          
                 <Link to="/products" class="nav-link">Products<span class="sr-only"></span></Link>
                </li>
              
              </ul>
          
            </div>
          </nav>
        </header>
    
  
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>Sl No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
       
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              {/* <td>
                {user.image ? (
                  <img 
                    src={`http://localhost:8000${user.image}`} 
                    alt="User" 
                    width="50" 
                    height="50" 
                    style={{ borderRadius: "50%" }}
                  />
                ) : (
                  "No Image Available"
                )}
              </td> */}
              <td>
                {/* <Link to={`/update/${user._id}`} type="button" className="btn btn-info">
                  <i className="fa-solid fa-pen-to-square"></i>
                </Link> */}
                &nbsp;
                <button
                  onClick={() => deleteUser(user._id)}
                  type="button"
                  className="btn btn-danger"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default User;
