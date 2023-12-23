import React, { useState, useEffect } from 'react';
import './App.css';

const URL = 'https://mocki.io/v1/0934df88-6bf7-41fd-9e59-4fb7b8758093';

const App = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [isGridView, setIsGridView] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(URL);
        const { data } = await response.json(); 
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchKey(searchTerm);
  
    const filtered =
      Array.isArray(products) && products.length > 0
        ? products.filter((product) => {
            const title = product.product_title ? product.product_title : '';
            const variants =
              product.product_variants &&
              product.product_variants
                .map((variant) => {
                  const variantValues =
                    variant &&
                    variant.v1 &&
                    variant.v2 &&
                    variant.v3 &&
                    Object.values(variant).map((value) =>
                      value ? value : ''
                    );
  
                  return variantValues ? variantValues.join(', ') : '';
                })
                .join(', ');
  
            return title.includes(searchTerm) || variants.includes(searchTerm);
          })
        : [];
  
    setFilteredProducts(filtered);
  };
  
  
  const toggleLayout = () => {
    setIsGridView((prevState) => !prevState);
  };
  
  return (
    <div style={{alignItems:'center', justifyContent:'center'}}>
      <input type="text" placeholder="Search products" value={searchKey} onChange={handleSearch} />
  
      <button onClick={toggleLayout} style={{alignItems:'center', justifyContent:'center'}}>
        {isGridView ? 'Switch to List View' : 'Switch to Grid View'}
      </button>
  
      <div className={isGridView ? 'grid-container' : 'list-container'} style={{justifyContent:'center'}}>
        {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.product_title} className={isGridView ? 'grid-card' : 'list-card'}>
              <img src={product.product_image} alt={product.product_title} />
              <h3>{product.product_title}</h3>
              <p>{product.product_badge}</p>
              <ul>
                {product.product_variants.map((variant, index) => (
                  <li
                    key={index}
                    className={
                      (variant.v1 && variant.v1.includes(searchKey) ? 'highlight' : '') ||
                      (variant.v2 && variant.v2.includes(searchKey) ? 'highlight' : '') ||
                      (variant.v3 && variant.v3.includes(searchKey) ? 'highlight' : '')
                    }
                  >
                    {`${variant.v1}, ${variant.v2}, ${variant.v3}`}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
  };
  
  export default App;