import { useState, useRef, Fragment, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchBar from "./Components/SearchBar"
import Gallery from "./Components/Gallery"
import AlbumView from "./Components/AlbumView";
import ArtistView from "./Components/ArtistView";
import { DataContext } from "./context/DataContext"
import { SearchContext } from "./context/SearchContext";
import { createResource as fetchData } from "./helper";
import Spinner from "./Spinner";

function App() {
  const [message, setMessage] = useState('Search for Music!')
  const [data, setData] = useState(null)
  let searchInput = useRef('')

  const handleSearch = (e, term) => {
    e.preventDefault()
    setData(fetchData(term, 'main'))
  }

  const renderGallery = () => {
    if (data) {
      return (
        <Suspense fallback={<Spinner />}>
          <Gallery />
        </Suspense>
      )
    }
  }


  // const handleSearch = (e, term) => {
  //   // stops the page from refeshing on submit click
  //   e.preventDefault()
  //   const fetchData = async () => {
  //     const url = encodeURI(`https://itunes.apple.com/search?term=${term}`)
  //     document.title = `${term} Music`
  //     const response = await fetch(url)
  //     const data = await response.json()
  //     console.log(data)

  //     if (data.results.length) {
  //       setData(data.results)
  //     } else {
  //       setMessage('Not Found')
  //     }
  //   }
  //   if (term)
  //     fetchData()
  // }

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
                {renderGallery()}
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
