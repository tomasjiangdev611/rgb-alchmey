import { useEffect, useState } from 'react';
import AlchemyService from './services/ApiService';
import { RGBAlchemy } from './models';
import './App.css';
import AlchemyInfo from './components/AlchemyInfo/AlchemyInfo';

function App() {
  const [alchemyData, setAlchemyData] = useState<RGBAlchemy>()

  useEffect(() => {
    const apiService = new AlchemyService();
    apiService.getAlchemyInitialData()
      .then((response) => {
        setAlchemyData({
          ...response,
          movesLeft: response.maxMoves,
          closet: null,
          percentage: 100.00
        })
      })
      .catch(() => {
        console.error('unable to fetch data from server')
      })
  }, [])

  return (
    <div className="App">
      <AlchemyInfo info={alchemyData} />
    </div>
  );
}

export default App;
