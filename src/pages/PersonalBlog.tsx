import BlogEntry from "../components/BlogEntry";

//
import {
  getData,
  getDocId,
  getEntryPointer,
  getEntrySize,
  getPaginationByteRange,
  getPathUsingEnvironment,
  trimTrailingNuls,
  validateFormatHeader,
} from "../lib/getData";

// User components
import "../components/userComponents/Images";
import "../components/userComponents/Paragraph";
import "../components/userComponents/HorizontalSpacer";
import "../components/userComponents/VerticalSpacer";
import { Index, Show, createEffect, createSignal } from "solid-js";
import PageLoading from "../components/PageLoading";

const PAGE_LENGTH = 10;

interface Entry {
  title?: string;
  content?: string;
  slug?: string;
  timestamp?: number;
}

type EntryJson = Omit<Entry, "slug"|"content">;
type EntryHtml = string;

function PersonalBlog() {
  const [loading, setLoading] = createSignal<boolean>(false);
  const [currentPage] = createSignal<number>(0);
	const [pages, setPages] = createSignal<number>(0);
  const [entries, setEntries] = createSignal<Array<Entry>>([]);
  createEffect(async () => {
    setLoading(true);
    try {
      const [fullHeader, resHeaders] = await getData(
        "/data/blog/pointer.bin",
        0,
        81,
      );
      // const contentLength = parseInt(
      //   resHeaders.get("content-range")?.match("[0-9]*$")?.[0] ?? "",
      // );
      const contentLength = parseInt(resHeaders.get("content-length") ?? "");
      if (isNaN(contentLength)) {
        throw new Error("unexpected content length");
      }
      validateFormatHeader(fullHeader);
      const docId = getDocId(fullHeader);
      if (docId !== 0x1a) {
        console.error("Wrong DocId");
      }
      const entrySize = getEntrySize(fullHeader);
      // const bitmasks = getBitmasks(fullHeader);
      const entryPointer = getEntryPointer(fullHeader);
      const [firstPageByte, lastPageByte, numOfPages] = getPaginationByteRange(
        entryPointer,
        Number(entrySize),
        currentPage(),
        PAGE_LENGTH,
        contentLength,
      );
			if (numOfPages === -1) {
				throw new Error('getPaginationByteRange failed to get any content');
			}
			setPages(numOfPages);
      const [entries] = await getData(
        "/data/blog/pointer.bin",
        firstPageByte,
        lastPageByte,
      );
      const currentPageEntries = entries.length / Number(entrySize);
      const entryIds = Array<string>(currentPageEntries);
      const promisesOfEntries =
        Array<Promise<EntryJson | EntryHtml>>(currentPageEntries * 2);
      for (let i = 0; i < currentPageEntries; ++i) {
        const iByte = i * Number(entrySize);
        const firstByte = entries.length - iByte - Number(entrySize);
        const lastByte = entries.length - iByte;
        entryIds[i] = new TextDecoder("utf-8").decode(
          trimTrailingNuls(entries.slice(firstByte, lastByte)),
        );
        promisesOfEntries[i] = (
          await fetch(getPathUsingEnvironment(`/data/blog/${entryIds[i]}.json`))
        ).json();
				promisesOfEntries[i+currentPageEntries] = new Promise(async (resolve, reject) => {
					const res = await fetch(getPathUsingEnvironment(`/data/blog/${entryIds[i]}.html`));
					if (!res.ok) {
						reject(await res.text());
					}
					resolve(await res.text());
				});
      }
      const resolvedEntries = await Promise.allSettled(promisesOfEntries);
      const _entries = [];
      for (let i = 0; i < currentPageEntries; ++i) {
        const resolvedEntryJson = resolvedEntries[i];
				const resolvedEntryHtml = resolvedEntries[i + currentPageEntries];
        // if (resolvedEntry.status === "rejected") {
        //   _entries.push({}); // Let it be added on error
        //   continue;
        // }
				console.log(resolvedEntryHtml)
        _entries.push({
					title: (resolvedEntryJson.status === 'rejected') ? undefined : (resolvedEntryJson.value as EntryJson).title,
					timestamp: (resolvedEntryJson.status === 'rejected') ? undefined : (resolvedEntryJson.value as EntryJson).timestamp,
					// Handle local dev (public dir) html checking by avoiding html tag since it is relatively easy to look
					content: (resolvedEntryHtml.status === 'rejected') || ((resolvedEntryHtml.value as EntryHtml).startsWith('<!doctype html>\n<html')) ? undefined : (resolvedEntryHtml.value as EntryHtml),
          slug: entryIds[i],
        });
      }
      setEntries(_entries);
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  });
  return (
    <div class="flex flex-1 flex-justify-center mt-8">
      <div class="flex flex-col max-w-275 w-75% gap-16 pb-8">
        <Show
          when={!loading()}
          fallback={<PageLoading />}
        >
          <Index each={entries()}>
            {(blogEntry) => (
              <BlogEntry
                title={blogEntry().title}
                content={blogEntry().content}
                timestamp={blogEntry().timestamp}
              />
            )}
          </Index>
					<div class="text-center">
					Page {currentPage() + 1} / {pages() + 1}
					</div>
        </Show>
      </div>
    </div>
  );
}

export default PersonalBlog;
