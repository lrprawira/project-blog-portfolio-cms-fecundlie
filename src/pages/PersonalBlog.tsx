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
import { Index, createEffect, createSignal } from "solid-js";

const PAGE_LENGTH = 10;

interface Entry {
  title?: string;
  content?: string;
  slug?: string;
  timestamp?: number;
}

function PersonalBlog() {
  const [currentPage] = createSignal<number>(0);
  const [entries, setEntries] = createSignal<Array<Entry>>([]);
  createEffect(async () => {
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
    const [firstPageByte, lastPageByte] = getPaginationByteRange(
      entryPointer,
      Number(entrySize),
      currentPage(),
      PAGE_LENGTH,
      contentLength,
    );
    const [entries] = await getData(
      "/data/blog/pointer.bin",
      firstPageByte,
      lastPageByte,
    );
    const currentPageEntries = entries.length / Number(entrySize);
    const entryIds = Array<string>(currentPageEntries);
    const promisesOfEntries =
      Array<Promise<Omit<Entry, "slug">>>(currentPageEntries);
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
    }
    const resolvedEntries = await Promise.allSettled(promisesOfEntries);
    const _entries = [];
    for (let i = 0; i < currentPageEntries; ++i) {
      const resolvedEntry = resolvedEntries[i];
      if (resolvedEntry.status === "rejected") {
        continue;
      }
      _entries.push({
        ...resolvedEntry.value,
        slug: entryIds[i],
      });
    }
    setEntries(_entries);
  });
  return (
    <div class="flex flex-1 flex-justify-center mt-8">
      <div class="flex flex-col max-w-275 w-75% gap-16 pb-8">
        <Index each={entries()}>
          {(blogEntry) => (
            <BlogEntry
              title={blogEntry().title}
              content={blogEntry().content}
              timestamp={blogEntry().timestamp}
            />
          )}
        </Index>
      </div>
    </div>
  );
}

export default PersonalBlog;
