import { NextResponse } from 'next/server';

interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
}

function stripHTMLTags(s: string): string {
  return s.replace(/<[^>]*>/g, '');
}

function extractThumbnail(description: string): string {
  const imgMatch = description.match(/<img[^>]+src="([^"]+)"/);
  return imgMatch ? imgMatch[1] : '';
}

function parseRSSItems(xml: string): RSSItem[] {
  const items: RSSItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemContent = match[1];
    const title = itemContent.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)
      || itemContent.match(/<title>([\s\S]*?)<\/title>/);
    const link = itemContent.match(/<link>([\s\S]*?)<\/link>/);
    const description = itemContent.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)
      || itemContent.match(/<description>([\s\S]*?)<\/description>/);
    const pubDate = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);

    items.push({
      title: title ? title[1].trim() : '',
      link: link ? link[1].trim() : '',
      description: description ? description[1].trim() : '',
      pubDate: pubDate ? pubDate[1].trim() : '',
    });
  }

  return items;
}

export async function GET() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const resp = await fetch('https://medium.com/feed/@kkamalesh117', {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });

    clearTimeout(timeout);

    if (!resp.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch Medium feed' },
        { status: 503 }
      );
    }

    const xml = await resp.text();
    const items = parseRSSItems(xml);

    const posts = items.map((item) => {
      let desc = item.description;
      const thumbnail = extractThumbnail(desc);

      if (desc.length > 300) {
        desc = desc.slice(0, 300) + '...';
      }

      return {
        title: item.title,
        link: item.link,
        description: stripHTMLTags(desc),
        pub_date: item.pubDate,
        thumbnail,
      };
    });

    return NextResponse.json(posts);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch Medium feed' },
      { status: 503 }
    );
  }
}
