import React, { useEffect, useState } from 'react';
import Header from './Header';
import './AddProduct.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AddProduct = () => {
  const navigate = useNavigate();
  const [pname, setPname] = useState('');
  const [pdesc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [pimage, setImage] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  const handleApi = (e) => {
    e.preventDefault(); // Prevent default form submission

    navigator.geolocation.getCurrentPosition((position) => {
      const formData = new FormData();
      formData.append('plat', position.coords.latitude);
      formData.append('plong', position.coords.longitude);
      formData.append('pname', pname);
      formData.append('pdesc', pdesc);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('pimage', pimage);
      formData.append('userId', localStorage.getItem('userId'));

      const url = 'http://localhost:5000/addproduct';
      axios.post(url, formData)
        .then((res) => {
          if (res.data.message) {
            alert('Product added successfully');
            navigate('/');
          } else {
            alert('Failed to add product');
          }
        })
        .catch((err) => {
          alert('An error occurred while adding the product');
        });
    }, (error) => {
      alert('Failed to get geolocation');
    });
  };

  return (
    <div>
      <Header />
      <div className='addproduct'>
        <h2>ADD PRODUCT HERE :</h2>
        <form className="addproduct-form" onSubmit={handleApi}>
          <label htmlFor="productName">Product Name</label>
          <input
            id="productName"
            type="text"
            name="productName"
            value={pname}
            onChange={(e) => setPname(e.target.value)}
            required
          />

          <label htmlFor="productDescription">Product Description</label>
          <input
            id="productDescription"
            type="text"
            name="productDescription"
            value={pdesc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />

          <label htmlFor="productPrice">Product Price</label>
          <input
            id="productPrice"
            type="number"
            name="productPrice"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <label htmlFor="productCategory">Product Category</label>
          <select
            id="productCategory"
            name="productCategory"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>Select a category</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Electronics Communication Engineering">Electronics Communication Engineering</option>
            <option value="Computer Science Engineering">Computer Science Engineering</option>
            <option value="Mathematics Statistics">Mathematics Statistics</option>
            <option value="Materials Science Engineering">Materials Science Engineering</option>
            <option value="Industrial Engineering">Industrial Engineering</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Economics">Economics</option>
            <option value="Humanities">Humanities</option>
            <option value="Environmental Science">Environmental Science</option>
          </select>

          <label htmlFor="productImage">Product Image</label>
          <input
            id="productImage"
            type="file"
            name="productImage"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />

          <button type="submit" className="submit-button">Add Product</button>
        </form>
      </div>
    </div>
  );
};
