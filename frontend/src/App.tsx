import { useEffect, useState } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import AlchemyService from './services/ApiService';
import * as ColorService from './services/Color.service';
import { renderTooltip } from './services/RenderTooltip';
import { DirectionTypes, ItemTypes, PaletteItem, RGBAlchemy } from './models';
import Source from './components/Source/Source';
import Tile from './components/Tile/Tile';
import './App.css';

type ClosetColor = {
  color: string,
  colorArray: Array<number>,
  closeValue: number,
  row: number,
  col: number,
}

const apiService = new AlchemyService();

function App() {
  const [alchemyData, setAlchemyData] = useState<RGBAlchemy>(null)
  const [palette, setPalette] = useState<Array<PaletteItem[]>>(null)
  const [currentTry, setCurrentTry] = useState(0);
  const [closetColor, setClosetColor] = useState<ClosetColor>(null)

  useEffect(() => {
    apiService.getAlchemyInitialData()
      .then((response) => {
        setAlchemyData(response)
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

  useEffect(() => {
    if (alchemyData && currentTry === alchemyData.maxMoves) {
      setTimeout(() => {
        const alertMessage = `
        ${closetColor.closeValue <= 0.1 ? 'You Win!' : 'You failed'} Do you want to try try again?
      `
        const retry = window.confirm(alertMessage);
        if (retry) {
          apiService.getAlchemyDataByUserId(alchemyData.userId)
            .then((response) => {
              setAlchemyData({
                ...response,
              })
              setCurrentTry(0);
              setClosetColor(null)
            })
            .catch(() => {
              console.error('unable to fetch data from server')
            })
        }
      }, 500)
      
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTry, alchemyData])

  useEffect(() => {
    if (palette && currentTry !== 0) {
      let minColor: ClosetColor = {
        color: null,
        colorArray: [0, 0, 0],
        closeValue: 100000,
        row: 0,
        col: 0,
      };
      palette.forEach((rowArray, rowIndex) => {
        rowArray.forEach((item, colIndex) => {
          if (item.type !== ItemTypes.TILE) {
            return;
          }
          const relation = ColorService.getCloseValue(item.colorArray, alchemyData.target);
          if (minColor.closeValue > relation) {
            minColor = {
              color: item.color,
              colorArray: item.colorArray,
              closeValue: relation,
              row: rowIndex,
              col: colIndex,
            }
          }
        })
      })
      setClosetColor(minColor)
    }
  }, [palette, alchemyData, currentTry])

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
    if (currentTry > 2) {
      return;
    }
    const updatedPalette = getUpdatedPalette(row, col, [0, 0, 0]);
    setPalette(updatedPalette);
    setCurrentTry(currentTry + 1)
  }

  const onDragTile = (sourceRow: number, sourceCol: number, colorArray: Array<number>) => {
    if (currentTry < 3) {
      return;
    }
    const updatedPalette = getUpdatedPalette(sourceRow, sourceCol, colorArray);
    setPalette(updatedPalette);
    setCurrentTry(currentTry + 1)
  }

  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        {
          alchemyData && (
            <div className="info mt-3">
              <h3>RGB Alchemy</h3>
              <div className="d-flex">
                <span className="p-1">User ID: </span>
                <span className="p-1">{alchemyData.userId}</span>
              </div>
              <div className="d-flex">
                <span className="p-1">Moves left: </span>
                <span className="p-1">{alchemyData.maxMoves - currentTry}</span>
              </div>
              <div className="d-flex">
                <span className="p-1">Target color: </span>
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 100, hide: 100 }}
                  overlay={(props) => renderTooltip(props, alchemyData.target)}
                >
                  <span
                    className='empty-item p-1'
                    style={{ backgroundColor: ColorService.getRGBString(alchemyData.target) }}
                  />
                </OverlayTrigger>
              </div>
              <div className="d-flex">
                <span className="p-1">Closest color: </span>
                <span className="p-1">
                  {
                    closetColor && (
                      <div className="d-flex">
                        <OverlayTrigger
                          placement="right"
                          delay={{ show: 100, hide: 100 }}
                          overlay={(props) => renderTooltip(props, closetColor?.colorArray)}
                        >
                          <span
                            className='empty-item p-1 '
                            style={{
                              backgroundColor: ColorService.getRGBString(closetColor?.colorArray),
                              marginRight: '8px'
                            }}
                          />
                        </OverlayTrigger>
                        △ = {(closetColor?.closeValue * 100).toFixed(2)}%
                      </div>
                    )
                  }
                </span>
              </div>
            </div>
          )
        }
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
                            palette={palette}
                            row={row}
                            col={col}
                            onClickSource={onClickSource}
                          />
                        )
                      }
                      {
                        palette.type === ItemTypes.TILE && (
                          <Tile
                            palette={palette}
                            onDragTile={onDragTile}
                            draggable={currentTry > 2}
                            hightLight={ closetColor && closetColor.col === col && closetColor.row === row }
                          />
                        )
                      }
                      {
                        palette.type === ItemTypes.NONE && <span className='empty-item'></span>
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
