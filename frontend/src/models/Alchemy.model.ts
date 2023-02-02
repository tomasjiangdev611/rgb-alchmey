export interface RGBAlchemy {
	userId: string,
	width: number,
	height: number,
	maxMoves: number,
	movesLeft: number,
	target: Array<number>,
	closet: Array<number> | null,
	percentage: number,
}
