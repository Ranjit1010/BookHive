import React, { useEffect, useState } from 'react';
import Header from './Header';
import './EditProduct.css'
import './AddProduct.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export const EditProduct = () => {
  const p = useParams();
  console.log(p);
  const navigate = useNavigate();
  const [pname, setPname] = useState('');
  const [pdesc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [pimage, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // For image preview

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const url = "http://localhost:5000/get-product/" + p.productId;
    axios.get(url)
      .then((res) => {
        if (res.data.product) {
          console.log(res.data.product);
          let product = res.data.product;
          setPname(product.pname);
          setDesc(product.pdesc);
          setPrice(product.price);
          setCategory(product.category);
          setImagePreview(`http://localhost:5000/${product.pimage}`); // Existing image preview
        }
      })
      .catch((err) => {
        alert("server error");
      });
  }, [p.productId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Preview selected image
    }
  };

  const handleApi = (e) => {
    e.preventDefault(); // Prevent default form submission

      const formData = new FormData();
      formData.append('pid',p.productId);
      formData.append('pname', pname);
      formData.append('pdesc', pdesc);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('pimage', pimage);
      formData.append('userId', localStorage.getItem('userId'));

      const url = 'http://localhost:5000/edit-product';
      axios.post(url, formData)
        .then((res) => {
          if (res.data.message) {
            alert('Product edited successfully');
            navigate('/');
          } else {
            alert('Failed to edit product');
          }
        })
        .catch((err) => {
          alert('An error occurred while editing the product');
        });
    
  };

  return (
    <div>
      <Header />
      <div className='addproduct'>
        <h2>EDIT PRODUCT HERE :</h2>
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
            <option value="Structural Engineering">Structural Engineering</option>
            <option value="Industrial Engineering">Industrial Engineering</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Business & Management">Business & Management</option>
            <option value="Economics">Economics</option>
            <option value="Humanities">Humanities</option>
            <option value="Environmental Science">Environmental Science</option>
          </select>

          <label htmlFor="productImage">Product Image</label>
          <input
            id="productImage"
            type="file"
            name="productImage"
            onChange={handleImageChange}
            required
          />
          {imagePreview && (
            <img src={imagePreview} alt="Product Preview" className="image-preview" />
          )}

          <button type="submit" className="submit-button">Save Changes</button>
        </form>
      </div>
    </div>
  );
};
