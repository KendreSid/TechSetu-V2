/**
 * Fetches the channel's newest videos at BUILD time (not when a visitor opens the page).
 * That is why the site stays fast and cannot break from a YouTube outage:
 * the result is baked into the static pages, and a scheduled rebuild refreshes it.
 */
import fallback from '../data/videos.fallback.json';

const CHANNEL_ID = 'UC6X32faDrZudxo6yZ2OPgVA';
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

export interface Video {
  id: string;
  title: string;
  /** ISO date text, e.g. 2026-10-18T09:00:00+00:00 */
  publishedAt: string;
}

/**
 * Returns up to `limit` newest videos, newest first.
 * Never throws: if YouTube cannot be reached or the answer looks wrong,
 * it logs a warning and returns the saved fallback list instead,
 * so a bad moment at YouTube cannot fail our whole build.
 */
export async function getLatestVideos(limit = 6): Promise<Video[]> {
  try {
    const response = await fetch(FEED_URL);
    if (!response.ok) throw new Error(`YouTube feed answered ${response.status}`);
    const videos = parseFeed(await response.text());
    if (videos.length === 0) throw new Error('YouTube feed contained no videos');
    return videos.slice(0, limit);
  } catch (error) {
    console.warn('[youtube] using fallback videos:', error);
    return (fallback as Video[]).slice(0, limit);
  }
}

/**
 * Turns the feed text (XML) into a list of videos.
 * Each <entry> block holds one video; we pick out id, title and date.
 */
function parseFeed(xml: string): Video[] {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  return entries
    .map((entry) => ({
      id: pick(entry, /<yt:videoId>(.*?)<\/yt:videoId>/),
      title: decodeEntities(pick(entry, /<title>(.*?)<\/title>/)),
      publishedAt: pick(entry, /<published>(.*?)<\/published>/),
    }))
    .filter((video) => video.id !== '');
}

/** Returns the first captured group of `pattern`, or an empty string. */
function pick(text: string, pattern: RegExp): string {
  return text.match(pattern)?.[1] ?? '';
}

/** Feed text escapes characters like & as &amp;; this turns them back. */
function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}
