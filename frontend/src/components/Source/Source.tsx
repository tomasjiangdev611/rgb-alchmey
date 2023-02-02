import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../models/ItemTypes';

type Props = {
	color: string,
	row: number,
	col: number,
	onClickSource: (row: number, col: number) => any
}

const sourceStyle = {
	height: '32px',
	width: '32px',
	borderRadius: '50%'
}

const Source: React.FC<Props> = ({ color, row, col, onClickSource }) => {
	const [_, drop] = useDrop(() => ({
		accept: ItemTypes.TILE,
		drop: () => ({ row, col }),
		collect: (monitor: any) => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
	}), [color])
	
  return (
		<div
			ref={drop}
			style={{ ...sourceStyle, backgroundColor: color }}
			onClick={() => onClickSource(row, col)}
		/>
  );
}

export default Source;
