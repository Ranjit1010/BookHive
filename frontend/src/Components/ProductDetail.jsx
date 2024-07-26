import React, { useState, useEffect } from "react";
import Header from "./Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProductDetail.css";
import io from 'socket.io-client';

let socket;

const ProductDetail = () => {
  const [product, setProduct] = useState();
  const [user, setUser] = useState();
  const [msg, setMsg] = useState('');
  const [msgss, setMsgss] = useState([]);
  const p = useParams();

  useEffect(() => {
    socket = io("http://localhost:5000");

    socket.on('connect', () => {
      console.log('connected');
    });

    return () => {
      socket.off();
    };
  }, []);

  useEffect(() => {
    socket.on('getMsg', (data) => {
      const _data = data.filter((item) => item.productId === p.productId);
      setMsgss(_data);
    });
  }, [p.productId]);

  const handleSend = () => {
    const data = {
      username: localStorage.getItem('username'),
      msg,
      productId: localStorage.getItem('productId')
    };
    socket.emit('sendMsg', data);
    setMsg('');
  };

  useEffect(() => {
    const url = `http://localhost:5000/get-product/${p.productId}`;
    axios.get(url)
      .then((res) => {
        if (res.data.product) {
          setProduct(res.data.product);
          localStorage.setItem('productId', res.data.product._id);
        }
      })
      .catch((err) => {
        alert("server error");
      });
  }, [p.productId]);

  const handleContact = (addedBy) => {
    const url = `http://localhost:5000/get-user/${addedBy}`;
    axios.get(url)
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user);
        }
      })
      .catch((err) => {
        alert("server error");
      });
  };

  return (
    <>
      <Header />
      <div className="product-detail-container">
        <div className="product-detail-header">PRODUCT DETAILS :</div>
        {product && (
          <div className="product-detail">
            <div>
              <img src={`http://localhost:5000/${product.pimage}`} alt={product.pname} />
            </div>
            <div className="product-info">
              <h6>Product Details :</h6>
              <p className="product-name">{product.pname}</p>
              <p className="product-category">{product.category}</p>
              <p className="product-price">₹{product.price}</p>
              <p>{product.pdesc}</p>

              {product.addedBy && (
                <button onClick={() => handleContact(product.addedBy)}>CONTACT</button>
              )}
              {user && user.username && (
                <>
                  <h4>{user.username}</h4>
                  <h4>{user.mobile}</h4>
                  <h4>{user.email}</h4>
                </>
              )}
            </div>
            
          </div>
        )}
        <div className="chat-container">
          <div className="chat-header">ChatBot</div>
          <div className="chat-body">
            {msgss && msgss.length > 0 && msgss.map((item, index) => (
              <div key={item._id} className={item.username === localStorage.getItem('username') ? "chat-message user-message" : "chat-message other-message"}>
                {item.username}: {item.msg}
              </div>
            ))}
          </div>
          <div className="chat-footer">
            <input value={msg} onChange={(e) => setMsg(e.target.value)} type="text" placeholder="Send a message..." />
            <button onClick={handleSend}>SEND</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
