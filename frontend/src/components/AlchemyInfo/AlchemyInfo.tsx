import React from 'react';
import { RGBAlchemy } from '../../models';

type AlchemyInfoProps = {
	info: RGBAlchemy | undefined
}

const AlchemyInfo: React.FC<AlchemyInfoProps> = ({info}) => {
	
  return (
    <div className="info-container">
			<h3>RGB Alchemy</h3>
			<div>
				<span>User ID: </span>
				<span>{info?.userId}</span>
			</div>
			<div>
				<span>Moves left: </span>
				<span>{info?.movesLeft}</span>
			</div>
			<div>
				<span>Target color: </span>
				<span>{info?.target}</span>
			</div>
			<div>
				<span>Closest color: </span>
				<span>{info?.closet} {info?.percentage}%</span>
			</div>
    </div>
  );
}

export default AlchemyInfo;
