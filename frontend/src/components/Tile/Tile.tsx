import React from 'react';
import type { DragSourceMonitor } from 'react-dnd'
import { useDrag } from 'react-dnd'
import { ItemTypes } from '../../models';

type Props = {
	color: string,
  colorArray: Array<number>,
	row: number,
	col: number,
	onDragTile: (row: number, col: number, color: Array<number>) => any,
	draggable: boolean
}

interface DropResult {
	row: number,
	col: number,
}

const sourceStyle = {
	height: '32px',
	width: '32px'
}

const Tile: React.FC<Props> = ({ color, colorArray, row, col, draggable, onDragTile }) => {
	const [_, drag] = useDrag(
    () => ({
      type: ItemTypes.TILE,
      end(item, monitor) {
        const dropResult = monitor.getDropResult() as DropResult
        if (item && dropResult) {
					onDragTile(dropResult.row, dropResult.col, colorArray)
        }
      },
      collect: (monitor: DragSourceMonitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
			canDrag: draggable
    }),
    [draggable],
  )
  return (
		<div
			ref={drag}
			style={{ ...sourceStyle, backgroundColor: color }}
		/>
  );
}

export default Tile;
