import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { useDrop } from 'react-dnd';

import { ItemTypes } from '../../models/ItemTypes';
import { renderTooltip } from '../../services/RenderTooltip';
import { PaletteItem } from '../../models';

type Props = {
	palette: PaletteItem,
	row: number,
	col: number,
	onClickSource: (row: number, col: number) => any
}

const sourceStyle = {
	height: '32px',
	width: '32px',
	cursor: 'pointer',
	borderRadius: '50%'
}

const Source: React.FC<Props> = ({
	palette,
	row,
	col,
	onClickSource
}) => {
	const [, drop] = useDrop(() => ({
		accept: ItemTypes.TILE,
		drop: () => ({ row, col }),
		collect: (monitor: any) => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
	}), [palette.color])
	
  return (
		<OverlayTrigger
      placement="right"
      delay={{ show: 100, hide: 100 }}
      overlay={(props) => renderTooltip(props, palette.colorArray)}
    >
			<div
				ref={drop}
				style={{ ...sourceStyle, backgroundColor: palette.color }}
				onClick={() => onClickSource(row, col)}
			/>
    </OverlayTrigger>
  );
}

export default Source;
