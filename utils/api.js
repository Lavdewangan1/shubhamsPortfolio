import fs from "fs";
import { join } from "path";
import matter from "gray-matter";

const postsDirectory = join(__dirname, "_posts"); // Use __dirname to get the current directory

export function getPostSlugs() {
  try {
    return fs.readdirSync(postsDirectory);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Warning: _posts directory does not exist');
      return [];
    } else {
      throw error;
    }
  }
}

export function getPostBySlug(slug, fields = []) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const items = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug;
    }
    if (field === "content") {
      items[field] = content;
    }

    if (typeof data[field]!== "undefined") {
      items[field] = data[field];
    }
  });

  return items;
}

export function getAllPosts(fields = []) {
  const slugs = getPostSlugs();
  const posts = slugs
   .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
   .sort((post1, post2) => (post1.date > post2.date? -1 : 1));
  return posts;
}