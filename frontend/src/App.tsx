import { useEffect, useState } from 'react';
import AlchemyService from './services/ApiService';
import { RGBAlchemy } from './models';
import './App.css';

function App() {
  const [alchemyData, setAlchemyData] = useState<RGBAlchemy | null>(null)

  useEffect(() => {
    const apiService = new AlchemyService();
    apiService.getAlchemyInitialData()
      .then((response) => {
        console.log('11111111111111111', response);
        setAlchemyData(response)
      })
      .catch(() => {
        console.error('unable to fetch data from server')
      })
  }, [])

  return (
    <div className="App">
    </div>
  );
}

export default App;
