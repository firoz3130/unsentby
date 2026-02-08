import { Client } from "@notionhq/client";

const notion = new Client({
  auth: import.meta.env.NOTION_API_KEY,
});

const databaseId = import.meta.env.NOTION_DATABASE_ID;

export async function fetchStories() {
  const res = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "published",
      checkbox: { equals: true },
    },
    sorts: [
      {
        property: "date",
        direction: "descending",
      },
    ],
  });

  return res.results.map((page: any) => {
    const props = page.properties;
    return {
      id: page.id,
      title: props.title?.rich_text?.[0]?.plain_text ?? "Untitled",
      slug: props.slug?.rich_text?.[0]?.plain_text ?? "",
      content: props.content?.rich_text?.[0]?.plain_text ?? "",
      mood: props.mood?.select?.name ?? "",
      tags: props.tags?.multi_select?.map((t: any) => t.name) ?? [],
      date: props.date?.date?.start ?? "",
    };
  });
}

export async function fetchStoryBySlug(slug: string) {
  const res = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        { property: "slug", rich_text: { equals: slug } },
        { property: "published", checkbox: { equals: true } },
      ],
    },
  });

  return res.results[0] ?? null;
}
