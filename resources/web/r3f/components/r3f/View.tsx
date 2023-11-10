'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { OrbitControls, View as ViewImpl } from '@react-three/drei';
import { r3f } from './tunnel';

const View = forwardRef(({ children, orbit, ...props }, ref) => {
	const localRef = useRef(null);
	useImperativeHandle(ref, () => localRef.current);

	return (
		<>
			<div ref={localRef} {...props} />
			<r3f.In>
				<ViewImpl track={localRef}>
					{children}
					{orbit && <OrbitControls />}
				</ViewImpl>
			</r3f.In>
		</>
	);
});
View.displayName = 'View';

export { View };
