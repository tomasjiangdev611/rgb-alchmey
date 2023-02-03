import { 
	DirectionTypes,
	ItemTypes,
	PaletteItem,
	RGBAlchemy
} from "../models";

export const getRGBString = (colorArray: Array<number>): string => {
  return `rgb(${colorArray[0].toFixed(0)}, ${colorArray[1].toFixed(0)}, ${colorArray[2].toFixed(0)})`
}

export const getInitialPalette = (width: number, height: number) => {
	const initialString = getRGBString([0, 0, 0]);
	let basicPalette = new Array(height + 2)
		.fill(initialString)
		.map(() => new Array(width + 2).fill(initialString));
	
	basicPalette = basicPalette.map((array, row) => {
		return array.map((item, col) => {
			let itemType = ItemTypes.TILE;
			if (
				(row === 0 && col === 0) || 
				(row === 0 && col === width + 1) ||
				(row === height + 1 && col === 0) ||
				(row === height + 1 && col ===  width + 1)
			) {
				itemType = ItemTypes.NONE;
			} else {
				if (row === 0 || row === height + 1 || col === 0 || col === width + 1) {
					itemType = ItemTypes.SOURCE;
				}
			}
			return {
				type: itemType,
				color: itemType === ItemTypes.NONE ? null : item,
				colorArray: [0, 0, 0]
			}
		})
	})
	
	return basicPalette;
}

export const getUpdatedPaletteWithClick = (
	alchemyData: RGBAlchemy,
	palette: Array<PaletteItem[]>,
	colorArray: Array<number>,
	row: number,
	col: number,
	direction: string,
) => {
	const updatedPalette = palette.map((rowArray, rowIndex) => {
		return rowArray.map((item, colIndex) => {
			if (direction === DirectionTypes.VERTICAL) {
				if (colIndex !== col) {
					return item;
				}
				let newColorArray = item.colorArray;
				const distance = alchemyData.height + 1 - Math.abs(row - rowIndex);
				// if (item.type !== ItemTypes.SOURCE) {
				newColorArray = item.colorArray.map((v, index) => v + colorArray[index] * distance / (alchemyData.height + 1))
				const normalization = Math.max(newColorArray[0], newColorArray[2], newColorArray[2], 255);
				newColorArray = newColorArray.map((v) => v * 255 / normalization)
				// } else {
				// 	newColorArray = item.colorArray.map((_, index) => colorArray[index] * distance / (alchemyData.height + 1))
				// }
				return {
					...item,
					color: getRGBString(newColorArray),
					colorArray: newColorArray,
				}
			} else {
				if (rowIndex !== row) {
					return item;
				}
				let newColorArray = item.colorArray;
				const distance = alchemyData.width + 1 - Math.abs(col - colIndex);
				newColorArray = item.colorArray.map(
					(v, index) => Math.min(v + colorArray[index] * distance / (alchemyData.width + 1), 255)
				)
				return {
					...item,
					color: getRGBString(newColorArray),
					colorArray: newColorArray,
				}
			}
		})
	})
	return updatedPalette;
}

export const getCloseValue = (curColor: Array<number>, targetColor: Array<number>) => {
	const rootValue = Math.sqrt(
		(curColor[0] - targetColor[0]) * (curColor[0] - targetColor[0]) + 
		(curColor[1] - targetColor[1]) * (curColor[1] - targetColor[1]) + 
		(curColor[2] - targetColor[2]) * (curColor[2] - targetColor[2])
	);
	const diff = rootValue / 255 / Math.sqrt(3);
	return diff;
}