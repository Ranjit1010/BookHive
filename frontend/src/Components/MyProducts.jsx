import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import "./MyProducts.css";
import "./Home.css";
import axios from "axios";
import Categories from "./Categories";
import { GoHeartFill } from "react-icons/go";

export const MyProducts = () => {
  const [product, setProduct] = useState([]);
  const [search, setSearch] = useState("");
  const [refresh, setrefresh] = useState(false);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const url = "http://localhost:5000/my-products";
    let data = { userId: localStorage.getItem("userId") };
    axios
      .post(url, data)
      .then((res) => {
        if (res.data.product) {
          setProduct(res.data.product);
          setFilteredProduct(res.data.product);
        }
      })
      .catch((err) => {
        alert("server error");
      });
  }, [refresh]);

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleClick = () => {
    setIsSearchActive(true);
    let filterProduct = product.filter((item) => {
      return (
        item.pname.toLowerCase().includes(search.toLowerCase()) ||
        item.pdesc.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilteredProduct(filterProduct);
  };

  const handleCategory = (value) => {
    setIsSearchActive(true);
    let filterProduct = product.filter((item) => {
      return item.category.toLowerCase() === value.toLowerCase();
    });
    setFilteredProduct(filterProduct);
  };

  const handleLike = (productId) => {
    let userId = localStorage.getItem("userId");
    console.log("userId", "productid", productId, userId);
    const url = "http://localhost:5000/like-products";
    const data = { userId, productId };
    axios
      .post(url, data)
      .then((res) => {
        if (res.data.message) {
          alert("liked");
        }
      })
      .catch((err) => {
        alert("server error");
      });
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleDelete = (pid) => {
    console.log(pid);
    if (!localStorage.getItem("userId")) {
      alert("Please Login First");
      return;
    }
    const url = "http://localhost:5000/delete-product";
    const data = {
      pid,
      userId: localStorage.getItem("userId"),
    };

    axios
      .post(url, data)
      .then((res) => {
        if (res.data.message) {
          alert("Delete Success");
          setrefresh(!refresh);
        }
      })
      .catch((err) => {
        alert("server error");
      });
  };

  return (
    <div className="home">
      <Header
        search={search}
        handleSearch={handleSearch}
        handleClick={handleClick}
      />
      <Categories handleCategory={handleCategory} />

      <h2>{isSearchActive ? "Search Result:" : "My Products:"}</h2>

      <div className="home-products">
        {filteredProduct &&
          filteredProduct.length > 0 &&
          filteredProduct.map((item) => {
            return (
              <div key={item._id} className="home-product-container">
                <div
                  className="home-product-card"
                  onClick={() => handleProductClick(item._id)}
                >
                  <div onClick={(e) => {
                      e.stopPropagation();
                      handleLike(item._id);
                    }}
                    className="icons-co">
                    <GoHeartFill className="icons" />
                  </div>
                  <img
                    src={"http://localhost:5000/" + item.pimage}
                    alt={item.pname}
                  />
                  <p className="home-product-card-category">
                    {item.pname} | {item.category}
                  </p>
                  <p className="home-product-card-price">₹{item.price}</p>
                  <p className="home-product-card-desc">{item.pdesc}</p>
                </div>
                <div className="product-buttons">
                <Link to={`/edit-product/${item._id}`}>
                  <button className="edit-product-button">Edit Product</button>
                </Link>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="delete-product-button">
                    Delete Product
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
