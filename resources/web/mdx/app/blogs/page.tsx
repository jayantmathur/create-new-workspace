import { MDXImport, Metadata } from './types';

const Page = async () => {
	const post = (await import(`./post/page.mdx`)) as MDXImport;
	const metadata: Metadata | undefined = post?.metadata;

	if (!metadata) {
		return <div>Metadata not found</div>;
	}
	return (
		<>
			<div>
				<h1>{metadata.title}</h1>
				<p>{metadata.publishedAt}</p>
				<p>{metadata.description}</p>
			</div>
		</>
	);
};

export default Page;
