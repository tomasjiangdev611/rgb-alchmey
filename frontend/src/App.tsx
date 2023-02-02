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

  const getUpdatedPalette = (row: number, col: number, customColorArray: Array<number>) => {
    let updatedPalette;
    if (alchemyData && palette) {
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
        default:
          colorArray = customColorArray
          break;
      }
      updatedPalette = ColorService.getUpdatedPaletteWithClick(
        alchemyData, [...palette], colorArray, row, col, direction
      );
    }
    return updatedPalette;
  }

  const onClickSource = (row: number, col: number) => {
    const updatedPalette = getUpdatedPalette(row, col, [0, 0, 0]);
    console.log('11111111111111 updated', updatedPalette)
    setPalette(updatedPalette);
    setCurrentTry(currentTry + 1)
  }

  const onDragTile = (sourceRow: number, sourceCol: number, colorArray: Array<number>) => {
    console.log('11111111111111 dropped', sourceRow, sourceCol, colorArray)
    const updatedPalette = getUpdatedPalette(sourceRow, sourceCol, colorArray);
    console.log('11111111111111 updated', updatedPalette)
    setPalette(updatedPalette);
    setCurrentTry(currentTry + 1)
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
                            onClickSource={onClickSource}
                          />
                        )
                      }
                      {
                        palette.type === ItemTypes.TILE && (
                          <Tile
                            color={palette.color}
                            colorArray={palette.colorArray}
                            row={row}
                            col={col}
                            onDragTile={onDragTile}
                            draggable={currentTry > 2}
                          />
                        )
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
