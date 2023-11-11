import { getAllBlogs, getBlog } from "./lib/functions";
import Card from "@/components/Card";

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
      {metadata?.map((meta, index) => meta && <Card key={index} meta={meta} />)}
    </>
  );
};

export default Page;
