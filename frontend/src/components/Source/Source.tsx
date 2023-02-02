import React from 'react';
import { useDrop } from 'react-dnd';
import { RGBAlchemy } from '../../models';
import { ItemTypes } from '../../models/ItemTypes';

type Props = {
	color: string,
	row: number,
	col: number,
	clickSource: (row: number, col: number) => any
}

const sourceStyle = {
	height: '32px',
	width: '32px',
	borderRadius: '50%'
}

const Source: React.FC<Props> = ({ color, row, col, clickSource }) => {
	const [{ canDrop, isOver }, drop] = useDrop(() => ({
		accept: ItemTypes.TILE,
		drop: () => ({ color }),
		collect: (monitor: any) => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
	}), [color])
	
  return (
		<div
			ref={drop}
			style={{ ...sourceStyle, backgroundColor: color }}
			onClick={() => clickSource(row, col)}
		/>
  );
}

export default Source;
