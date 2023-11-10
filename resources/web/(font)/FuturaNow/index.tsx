import localFont from 'next/font/local';

export const FuturaNow = localFont({
	src: [
		{ path: './FuturaNowText.ttf', weight: 'normal' },
		{ path: './FuturaNowTextBold.ttf', weight: '600' },
		{
			path: './FuturaNowTextItalic.ttf',
			weight: 'normal',
			style: 'italic'
		},
		{
			path: './FuturaNowTextBold.ttf',
			weight: '600',
			style: 'italic'
		}
	],
	variable: '--font-futura-now'
});
