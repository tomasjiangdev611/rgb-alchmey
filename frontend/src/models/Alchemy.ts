export interface RGBAlchemy {
	userId: string,
	width: number,
	height: number,
	maxMoves: number,
	target: Array<number>,
}

export interface PaletteItem {
  type: string,
  color: string,
  colorArray: Array<number>,
}