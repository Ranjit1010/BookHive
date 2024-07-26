import React, { useEffect, useState } from "react";
import Header from "./Header";
import "./Home.css";
import axios from "axios";
import Categories from "./Categories";
import Footer from "./Footer";
import { GoHeartFill } from "react-icons/go";
import { useNavigate } from 'react-router-dom'

export const Home = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState([]);
  const [likedproduct, setlikedProduct] = useState([]);
  const [refresh, setrefresh] = useState(false);
  console.log(likedproduct);
  const [search, setSearch] = useState('');
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // useEffect hook to fetch products when the component mounts
  useEffect(() => {
    const url = "http://localhost:5000/get-products";
    axios.get(url)
      .then((res) => {
        if (res.data.product) {
          setProduct(res.data.product); 
          setFilteredProduct(res.data.product);
        }
      })
      .catch((err) => {
        alert("server error");
      });

    const url2 = "http://localhost:5000/liked-products";
    let data = { userId: localStorage.getItem('userId') };
    axios.post(url2,data)
      .then((res) => {
        if (res.data.product) {
          setlikedProduct(res.data.product);
        }
      })
      .catch((err) => {
        alert("server error");
      });
  }, [refresh]);

  // Function to handle search input changes
  const handleSearch = (value) => {
    setSearch(value);
  };

  // Function to filter products based on search input
  const handleClick = () => {
    setIsSearchActive(true);

    const url = "http://localhost:5000/search?search=" + search + '&loc=' + localStorage.getItem('userLoc');
    axios.get(url)
      .then((res) => {
        console.log(res.data);
        setFilteredProduct(res.data.product);
        
      })
      .catch((err) => {
        alert("server error");
      });
  };

  // Function to filter products based on selected category
  const handleCategory = (value) => {
    setIsSearchActive(true);
    let filterProduct = product.filter((item) => {
      return item.category.toLowerCase() === value.toLowerCase();
    });
    setFilteredProduct(filterProduct);
  };



  const handleLike=(productId,e)=>{
    e.stopPropagation();
    let userId = localStorage.getItem('userId');

    if(!userId){
      alert('Please Login First');
    }
     
    const url = "http://localhost:5000/like-products";
    const data = {userId,productId}
    axios.post(url,data)
      .then((res) => {
        if(userId){
          // alert('liked')
          setrefresh(!refresh);
        }
        
      })
      .catch((err) => {
        alert("server error");
      });
  }



  const handleDisLike=(productId,e)=>{
    e.stopPropagation();
    let userId = localStorage.getItem('userId');

    if(!userId){
      alert('Please Login First');
    }
     
    const url = "http://localhost:5000/dislike-products";
    const data = {userId,productId}
    axios.post(url,data)
      .then((res) => {
        if(userId){
          // alert('disliked')
          setrefresh(!refresh);
        }
        
      })
      .catch((err) => {
        alert("server error");
      });
  }


  const handleProduct=(id)=>{
    navigate('/product/' + id)
  }

  return (
    <div className="home">
      <Header search={search} handleSearch={handleSearch} handleClick={handleClick} />
      <Categories handleCategory={handleCategory} />

      <h2>{isSearchActive ? "Search Result:" : "All Products:"}</h2>

     {/* Display the filtered products  */}
      <div className="home-products">
        {filteredProduct &&
          filteredProduct.length > 0 &&
          filteredProduct.map((item) => {
            return (
              <div onClick={()=>handleProduct(item._id)} key={item._id} className="home-product-card">
                <div className="icons-co">
                {
                  likedproduct.find((likedItem)=>likedItem._id ===item._id)?
                  <GoHeartFill onClick={(e)=> handleDisLike(item._id, e)} className="red-icons"/>:
                  <GoHeartFill onClick={(e)=> handleLike(item._id, e)} className="icons"/>
                }
                
                </div>
                <img src={"http://localhost:5000/" + item.pimage} alt={item.pname} />
                <p className="home-product-card-category">{item.pname} | {item.category}</p>
                <p className="home-product-card-price">₹{item.price}</p>
                <p className="home-product-card-desc">{item.pdesc}</p>
              </div>
            );
          })}
      </div>
      <Footer/>
    </div>
  );
};
