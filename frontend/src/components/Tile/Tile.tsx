import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import type { DragSourceMonitor } from 'react-dnd'
import { useDrag } from 'react-dnd'

import { renderTooltip } from '../../services/RenderTooltip';
import { ItemTypes, PaletteItem } from '../../models';

type Props = {
	palette: PaletteItem
	onDragTile: (row: number, col: number, color: Array<number>) => any,
	draggable: boolean,
	hightLight: boolean
}

interface DropResult {
	row: number,
	col: number,
}

const sourceStyle = {
	height: '32px',
	width: '32px',
	cursor: 'pointer',
}

const Tile: React.FC<Props> = ({
	palette,
	draggable,
	onDragTile,
	hightLight
}) => {
	const [, drag] = useDrag(
    () => ({
      type: ItemTypes.TILE,
      end(item, monitor) {
        const dropResult = monitor.getDropResult() as DropResult
        if (item && dropResult) {
					onDragTile(dropResult.row, dropResult.col, palette.colorArray)
        }
      },
      collect: (monitor: DragSourceMonitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
			canDrag: draggable
    }),
    [draggable, onDragTile],
  )

  return (
		<OverlayTrigger
      placement="right"
      delay={{ show: 100, hide: 100 }}
      overlay={(props) => renderTooltip(props, palette.colorArray)}
    >
      <div
				ref={drag}
				style={{ ...sourceStyle, backgroundColor: palette.color }}
				className={hightLight ? "highlight" : ''}
			/>
		</OverlayTrigger>
  );
}

export default Tile;
