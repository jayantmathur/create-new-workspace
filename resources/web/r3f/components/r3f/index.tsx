'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload , OrbitControls, View as ViewImpl } from '@react-three/drei';
import tunnel from 'tunnel-rat';

export const r3f = tunnel();

const Scene = ({ ...props })=> (
	// Everything defined in here will persist between route changes, only children are swapped
		<Canvas {...props}>
			{/* @ts-ignore */}
			<r3f.Out />
			<Preload all />
		</Canvas>
	);


const View = forwardRef(({ children, orbit, ...props }, ref) => {
	const localRef = useRef(null);
	useImperativeHandle(ref, () => localRef.current);

	return (
		<>
			<div ref={localRef} {...props} />
			<r3f.In>
				<ViewImpl track={localRef}>
					{children}
					{orbit && <OrbitControls makeDefault/>}
				</ViewImpl>
			</r3f.In>
		</>
	);
});

View.displayName = 'View';

export default Scene;
export { View };
