import { getAllBlogs, getBlog } from "./lib/functions";

const Page = async () => {
  const blogs = await getAllBlogs();

  const promises = blogs.map(async (blog) => {
    const post = await getBlog(blog);
    return post;
  });

  const posts = await Promise.all(promises);

  const metadata = posts?.map((post) => post?.metadata);

  return (
    <>
      {metadata?.map(
        (meta, index) =>
          meta && (
            <div key={index}>
              <div>{meta.title}</div>
              <div>{meta.publishedAt}</div>
              <div>{meta.description}</div>
            </div>
          ),
      )}
    </>
  );
};

export default Page;
