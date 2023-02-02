import React from 'react';
import type { DragSourceMonitor } from 'react-dnd'
import { useDrag } from 'react-dnd'
import { ItemTypes } from '../../models';

type Props = {
	color: string,
}

interface DropResult {
  color: string
}

const sourceStyle = {
	height: '32px',
	width: '32px'
}

const Tile: React.FC<Props> = ({ color }) => {
	const [{ opacity }, drag] = useDrag(
    () => ({
      type: ItemTypes.TILE,
      // item: { name },
      end(item, monitor) {
        const dropResult = monitor.getDropResult() as DropResult
        if (item && dropResult) {
          let alertMessage = dropResult.color
          alert(alertMessage)
        }
      },
      collect: (monitor: DragSourceMonitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [],
  )
  return (
		<div ref={drag} style={{ ...sourceStyle, backgroundColor: color }}>
			
    </div>
  );
}

export default Tile;
