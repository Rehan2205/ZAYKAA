import React, { useContext, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import FoodItem from '../../components/FoodItem/FoodItem';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { food_list } = useContext(StoreContext);
  const navigate = useNavigate();

  const filteredFoods = useMemo(() => {
    if (!query.trim()) return [];
    
    const searchLower = query.toLowerCase();
    return food_list.filter(item => {
      return (
        item.name.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.category?.toLowerCase().includes(searchLower)
      );
    });
  }, [food_list, query]);

  return (
    <div className='search-results-container'>
      <div className='search-results-header'>
        <h2>Search Results for "{query}"</h2>
        <p className='results-count'>
          {filteredFoods.length} {filteredFoods.length === 1 ? 'item' : 'items'} found
        </p>
      </div>

      {filteredFoods.length > 0 ? (
        <div className='search-results-list'>
          {filteredFoods.map((item) => (
            <FoodItem 
              key={item._id} 
              id={item._id}
              name={item.name}
              desc={item.description}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      ) : (
        <div className='no-results'>
          <h3>No items found</h3>
          <p>Try searching with different keywords</p>
          <button 
            className="back-to-menu-btn" 
            onClick={() => navigate('/')}
          >
            Back to Menu
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;