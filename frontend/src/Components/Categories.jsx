import React from "react";
import "./Categories.css";
import categories from './CategoriesList';
import { useNavigate } from "react-router-dom";

function Categories(props){

  const navigate = useNavigate();

  return (
    <div className="categories">
    <div>
      <span className="all-categories">All Categories</span>
       
        {categories && categories.length > 0 &&
          categories.map((item, index) => {
            return (
              <span onClick={()=>navigate('/category/'+ item)} key={index} className="categories-list">{item}</span>
            )
          })}
      </div>
    </div>
  );
};

export default Categories;

