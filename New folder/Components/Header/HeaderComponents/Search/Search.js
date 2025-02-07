import React, { useState } from 'react';
import './Search.css';
import SearchIcon from '../../../../assets/img/pngegg.png';

function Search() {
    const [input, setInput] = useState("");

    const handleSearch = () => {
        console.log("Search performed for:", input);
        // You can add more functionality here, like making an API call
    };

    return (
        <div className="search">
            <div className="search-bar">
                <img
                    src={SearchIcon}
                    alt="Search"
                    className="search-icon"
                    onClick={handleSearch}
                />
                <input 
                    type="text"  
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Search..."
                />
                <button onClick={handleSearch}>Search</button>
            </div>
        </div>
    );
}

export default Search;