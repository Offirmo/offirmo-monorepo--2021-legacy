import React from 'react'

function TBRPGElement({children, uuid}) {
	return (
		<span>
			[TBRPG Element #{uuid}
			{children}]
		</span>
	)
}

export {
	TBRPGElement,
}
