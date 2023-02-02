import { useEffect, useState } from 'react';
import AlchemyService from './services/ApiService';
import { DirectionTypes, ItemTypes, PaletteItem, RGBAlchemy } from './models';
import * as ColorService from './services/Color.service';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import './App.css';
import AlchemyInfo from './components/AlchemyInfo/AlchemyInfo';
import Source from './components/Source/Source';
import Tile from './components/Tile/Tile';


function App() {
  const [alchemyData, setAlchemyData] = useState<RGBAlchemy>()
  const [palette, setPalette] = useState<Array<PaletteItem[]>>()
  const [currentTry, setCurrentTry] = useState(0);

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

  useEffect(() => {
    if (alchemyData) {
      const panelItems = ColorService.getInitialPalette(alchemyData.width, alchemyData.height);
      setPalette(panelItems)
    }
  }, [alchemyData])

  const clickSource = (row: number, col: number) => {
    if (alchemyData && palette && currentTry < 3) {
      let updatedPalette: Array<PaletteItem[]> = [...palette];
      let direction;
      if (col === 0 || col === alchemyData.width + 1) {
        direction = DirectionTypes.HORIZONTAL
      } else {
        direction = DirectionTypes.VERTICAL
      }
      
      let colorArray: Array<number> = [];
      switch (currentTry) {
        case 0:
          colorArray = [255, 0, 0]
          break;
        case 1:
          colorArray = [0, 255, 0]
          break;
        case 2:
          colorArray = [0, 0, 255]
          break;
      }
      updatedPalette = ColorService.getUpdatedPaletteWithClick(
        alchemyData, updatedPalette, colorArray, row, col, direction
      );
      setPalette(updatedPalette);
      setCurrentTry(currentTry + 1)
    }
  }


  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <AlchemyInfo info={alchemyData} />
        <div className='palette-container'>
          {
            palette?.map((array, row) => (
              <div className='palette-row' key={row}>
                {
                  array.map((palette, col) => (
                    <div className='palette-item' key={col}>
                      {
                        palette.type === ItemTypes.SOURCE && (
                          <Source
                            color={palette.color}
                            row={row}
                            col={col}
                            clickSource={clickSource}
                          />
                        )
                      }
                      {
                        palette.type === ItemTypes.TILE && <Tile color={palette.color} />
                      }
                      {
                        palette.type === ItemTypes.NONE && <div className='empty-item'></div>
                      }
                    </div>
                  )) 
                }
              </div>
            ))
          }
        </div>
      </DndProvider>
    </div>
  );
}

export default App;
