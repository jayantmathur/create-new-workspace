'use client';

import { useRef } from 'react';
import Scene from '@/components/r3f';

const Provider = ({ children }) => {
	const ref = useRef();
	return (
		<div
			ref={ref}
            className="relative w-full h-full overflow-auto touch-auto"
		>
			{children}
			<Scene
                className="fixed top-0 left-0 w-full h-full pointer-events-none"
				eventSource={ref}
				eventPrefix="client"
			/>
		</div>
	);
};

export default Provider;
