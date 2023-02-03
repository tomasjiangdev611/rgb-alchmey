
import Tooltip from 'react-bootstrap/Tooltip';
import * as ColorService from './Color.service';

export const renderTooltip = (props: any, colorArray: Array<number>) => (
	<Tooltip id="tile-tooltip" {...props}>
		{ColorService.getRGBString(colorArray)}
	</Tooltip>
)