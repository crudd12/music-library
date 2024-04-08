import { useState, useRef, Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchBar from "./Components/SearchBar"
import Gallery from "./Components/Gallery"
import AlbumView from "./Components/AlbumView";
import ArtistView from "./Components/ArtistView";
import { DataContext } from "./context/DataContext"
import { SearchContext } from "./context/SearchContext";

function App() {
  const [message, setMessage] = useState('Search for Music!')
  const [data, setData] = useState([])
  let searchInput = useRef('')

  const handleSearch = (e, term) => {
    // stops the page from refeshing on submit click
    e.preventDefault()
    const fetchData = async () => {
      const url = encodeURI(`https://itunes.apple.com/search?term=${term}`)
      document.title = `${term} Music`
      const response = await fetch(url)
      const data = await response.json()
      console.log(data)

      if (data.results.length) {
        setData(data.results)
      } else {
        setMessage('Not Found')
      }
    }
    if (term)
      fetchData()
  }

  return (
    <div>
      {message}
      <Router>
        <Routes>
          <Route path="/" element={
            <Fragment>
              <SearchContext.Provider value={{
                term: searchInput,
                handleSearch: handleSearch
              }}>
                <SearchBar handleSearch={handleSearch} />
              </SearchContext.Provider>

              <DataContext.Provider value={data}>
                <Gallery />
              </DataContext.Provider>
            </Fragment>
          } />
          <Route path="/album/:id" element={<AlbumView />} />
          <Route path="/artist/:id" element={<ArtistView />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
