import { Index, Show, createEffect, createSignal, on, onMount } from "solid-js";

import BlogEntry from "../components/BlogEntry";
import PageLoading from "../components/PageLoading";

import { PERSONAL_BLOG_PATH, POINTER_BIN_FILE } from "../lib/constants";

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

import { useAdminStore } from "../lib/states";

// User components
import "../components/userComponents/Images";
import "../components/userComponents/Paragraph";
import "../components/userComponents/HorizontalSpacer";
import "../components/userComponents/VerticalSpacer";
import { useNavigate } from "@solidjs/router";

const PAGE_LENGTH = 3;

interface Entry {
  title?: string;
  content?: string;
  slug?: string;
  timestamp?: number;
}

type EntryJson = Omit<Entry, "slug" | "content">;
type EntryHtml = string;

function PersonalBlog() {
  const asAdmin = useAdminStore((state) => state.asAdmin);
  const navigate = useNavigate();
  const [loading, setLoading] = createSignal<boolean>(false);
  const [currentPage, setCurrentPage] = createSignal<number>(0);
  const [pages, setPages] = createSignal<number>(0);
  const [entries, setEntries] = createSignal<Array<Entry>>([]);

  // async function buildLocalGitRepo() {
  //   const dir = "/repo";
  //   const fs = new LightningFS("fs");
  //   const promisifiedFS = fs.promises;
  //   try {
  //     await git.clone({
  //       fs,
  //       http,
  //       dir,
  //       url: "https://github.com/lrprawira/project-blog-portfolio-cms-fecundlie",
  //       corsProxy: "https://cors.isomorphic-git.org",
  //       singleBranch: true,
  //       depth: 1,
  //     });
  //   } catch (e) {
  //     if (!(e instanceof Error)) {
  //       return;
  //     }
  //     if (e.name === "NotFoundError") {
  //       console.warn("FS error:", e.name, "Retrying...");
  //       fs.rmdir(dir, undefined, () => null);
  //       return buildLocalGitRepo();
  //     }
  //     console.error(e);
  //     return;
  //   }
  //   const fileList = await git.listFiles({ fs, dir });
  //   console.log(fileList);
  //   const blogPointers = await promisifiedFS.readFile(
  //     `${VFS_PREFIX}/${PERSONAL_BLOG_PATH}/${POINTER_BIN_FILE}`,
  //     undefined,
  //   );
  //   if (!(blogPointers instanceof Uint8Array)) {
  //     console.error("blogPointers is not Uint8Array");
  //     return;
  //   }
  //   console.log(blogPointers);
  //   // Add new blog pointer
  //   const newBlogPointers = new Uint8Array(blogPointers.length + 255);
  //   newBlogPointers.set(blogPointers);
  //   const newBlogPointerID = new Uint8Array(255)
  // newBlogPointerID.set(
  //     new TextEncoder().encode(nanoid(255)),
  //   );
  //   newBlogPointers.set(newBlogPointerID, blogPointers.length);
  // console.log(newBlogPointers);
  // }
  onMount(() => {
    // buildLocalGitRepo();
  });
  createEffect(
    on(currentPage, async () => {
      setLoading(true);
      try {
        const [fullHeader, resHeaders] = await getData(
          `${PERSONAL_BLOG_PATH}/${POINTER_BIN_FILE}`,
          0x0,
          82,
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
        const [firstPageByte, lastPageByte, numOfPages] =
          getPaginationByteRange(
            entryPointer,
            Number(entrySize),
            currentPage() * PAGE_LENGTH,
            PAGE_LENGTH,
            contentLength,
          );
        if (numOfPages === -1) {
          throw new Error("getPaginationByteRange failed to get any content");
        }
        setPages(numOfPages);
        const [entries] = await getData(
          `${PERSONAL_BLOG_PATH}/${POINTER_BIN_FILE}`,
          firstPageByte,
          lastPageByte - firstPageByte,
        );
        const currentPageEntries = entries.length / Number(entrySize);
        const entryIds = Array<string>(currentPageEntries);
        const promisesOfEntries = Array<Promise<EntryJson | EntryHtml>>(
          currentPageEntries * 2,
        );
        for (let i = 0; i < currentPageEntries; ++i) {
          const iByte = i * Number(entrySize);
          const firstByte = entries.length - iByte - Number(entrySize);
          const lastByte = entries.length - iByte;
          entryIds[i] = new TextDecoder("utf-8").decode(
            trimTrailingNuls(entries.slice(firstByte, lastByte)),
          );
          promisesOfEntries[i] = new Promise(async (resolve, reject) => {
            const res = await fetch(
              getPathUsingEnvironment(
                `${PERSONAL_BLOG_PATH}/${entryIds[i]}.json`,
              ),
            );
            if (!res.ok) {
              return reject(await res.text());
            }
            return resolve(await res.json());
          });
          promisesOfEntries[i + currentPageEntries] = new Promise(
            async (resolve, reject) => {
              const res = await fetch(
                getPathUsingEnvironment(
                  `${PERSONAL_BLOG_PATH}/${entryIds[i]}.html`,
                ),
              );
              if (!res.ok) {
                return reject(await res.text());
              }
              resolve(await res.text());
            },
          );
        }
        const resolvedEntries = await Promise.allSettled(promisesOfEntries);
        const _entries = [];
        for (let i = 0; i < currentPageEntries; ++i) {
          const resolvedEntryJson = resolvedEntries[i];
          const resolvedEntryHtml = resolvedEntries[i + currentPageEntries];
          _entries.push({
            title:
              resolvedEntryJson.status === "rejected"
                ? undefined
                : (resolvedEntryJson.value as EntryJson).title,
            timestamp:
              resolvedEntryJson.status === "rejected"
                ? undefined
                : (resolvedEntryJson.value as EntryJson).timestamp,
            // Handle local dev (public dir) html checking by avoiding html tag since it is relatively easy to look
            content:
              resolvedEntryHtml.status === "rejected" ||
              (resolvedEntryHtml.value as EntryHtml).startsWith(
                "<!doctype html>\n<html",
              )
                ? undefined
                : (resolvedEntryHtml.value as EntryHtml),
            slug: entryIds[i],
          });
        }
        setEntries(_entries);
      } catch (e) {
        throw e;
      } finally {
        setLoading(false);
      }
    }),
  );
  return (
    <div class="flex flex-1 flex-justify-center mt-8">
      <div class="flex flex-col max-w-275 w-75% gap-16 pb-8">
        <Show when={asAdmin()}>
          <div>
            <button
              onclick={() =>
                navigate("/wizard?category=personal-blog&type=new")
              }
            >
              Add new blog
            </button>
          </div>
        </Show>
        <Show when={!loading()} fallback={<PageLoading />}>
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
            <button
              disabled={currentPage() < 1}
              style={{ opacity: currentPage() < 1 ? 0 : 1 }}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>
            <span class="px-2">
              Page {currentPage() + 1} / {pages() + 1}
            </span>
            <button
              disabled={currentPage() >= pages()}
              style={{ opacity: currentPage() >= pages() ? 0 : 1 }}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default PersonalBlog;
