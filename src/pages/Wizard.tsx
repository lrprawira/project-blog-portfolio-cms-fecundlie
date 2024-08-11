import LightningFS from "@isomorphic-git/lightning-fs";
import http from "isomorphic-git/http/web";
import git from "isomorphic-git";

import { useNavigate, useSearchParams } from "@solidjs/router";
import { useAdminStore, useContentStore } from "../lib/states";
import { For, createSignal, onMount } from "solid-js";

import {
  Alignment,
  Essentials,
  BlockToolbar,
  Bold,
  Italic,
  Underline,
  Font,
  Paragraph,
  ClassicEditor,
  Strikethrough,
  Subscript,
  Superscript,
  Heading,
  Autosave,
  Editor,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { categories } from "../lib/constants";

const fs = new LightningFS("fs");
const pfs = fs.promises;

const Wizard = () => {
  const [queryParams, setQueryParams] = useSearchParams();
  const asAdmin = useAdminStore((state) => state.asAdmin);
  const title = useContentStore((state) => state.title);
  const slug = useContentStore((state) => state.slug);
  const content = useContentStore((state) => state.content);
  const setTitle = useContentStore((state) => state.setTitle);
  const setSlug = useContentStore((state) => state.setSlug);
  const setContent = useContentStore((state) => state.setContent);
  const [category, setCategory] = createSignal<string>();

  let contentEditor: Editor | undefined = undefined;
  let contentEditorRef!: HTMLDivElement;
  const navigate = useNavigate();

  onMount(async () => {
    if (!asAdmin()) {
      return navigate("/", { replace: true });
    }
		setCategory(categories.has(queryParams.category) ? queryParams.category : '');

    if (contentEditor) {
      return;
    }
    try {
      contentEditor = await ClassicEditor.create(contentEditorRef, {
        plugins: [
          Autosave,
          Essentials,
          Alignment,
          BlockToolbar,
          Bold,
          Italic,
          Underline,
          Strikethrough,
          Subscript,
          Superscript,
          Font,
          Paragraph,
          Heading,
        ],
        toolbar: [
          "undo",
          "redo",
          "|",
          "heading",
          "|",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "subscript",
          "superscript",
          "|",
          "alignment",
          "|",
          "link",
        ],
        initialData: content() || "",
        placeholder: "Type or paste your content here",
        autosave: {
          waitingTime: 1000,
          save(editor) {
            console.log(editor.getData());
            return new Promise((resolve) =>
              resolve(setContent(editor.getData())),
            );
          },
        },
        updateSourceElementOnDestroy: true,
      });
    } catch (e) {
      console.error(e);
    }
  });

  const handleAddToEntry: () => void = async () => {
    const now = Math.floor(Date.now() / 1000);
		// const timestamp = now;

		if (!categories.has(category())) {
			console.error("Category is invalid");
			return;
		}
    if (!slug()) {
      console.error("Slug is empty");
      return;
    }

    const dir = "/repo";

    let gitInitialised = true;
    console.log("1. Setting up git files");
    try {
      console.log("1.1. Trying to restore modified files");
      const fileList = await git.statusMatrix({
        fs,
        dir,
				filter: (f) => f.startsWith('public/data/'),
      });
      const fileRemovePromises = [];
      for (const file of fileList) {
				if (file[1] === 1 && file[2] === 1 && file[3] === 1) {
          continue;
        }
        console.log("Removing", file[0], 'with matrix', file.slice(1, 4));
        fileRemovePromises.push(pfs.unlink(`${dir}/${file[0]}`));
      }
      try {
        await Promise.allSettled(fileRemovePromises);
      } catch (e) {}
      git.checkout({
        fs,
        dir,
        ref: "master",
        force: true,
        filepaths: ["public/data"],
      });
      console.log("1.2. Normalising git files");
      await git.fetch({
        fs,
        http,
        dir,
        corsProxy: "https://cors.isomorphic-git.org",
        url: "https://github.com/lrprawira/project-blog-portfolio-cms-fecundlie.git",
        ref: "master",
        singleBranch: true,
        depth: 1,
        tags: false,
      });
    } catch (e) {
      gitInitialised = false;
    }
    if (!gitInitialised) {
      try {
        console.log("1.3. Running git clone");
        await git.clone({
          fs,
          http,
          dir,
          corsProxy: "https://cors.isomorphic-git.org",
          url: "https://github.com/lrprawira/project-blog-portfolio-cms-fecundlie.git",
          ref: "master",
          singleBranch: true,
          depth: 1,
          noTags: true,
        });
      } catch (e) {
        if (e instanceof Error && e.name === "NotFoundError") {
          console.warn("FS error:", e.name, "Retrying...");
          fs.rmdir(dir, undefined, () => null);
          return handleAddToEntry();
        }
      }
    }

    console.log("2. Determining if pointer entry exists");
    let pointerExists = false;
    try {
      pointerExists = !!(await pfs.readFile(
        `${dir}/public/data/blog/${slug()}.json`,
        undefined,
      ));
    } catch (e) {
      pointerExists = false;
    }

    if (pointerExists) {
      throw Error("Pointer exists");
    }

    const pointersPromise = pfs.readFile(
      `${dir}/public/data/blog/pointer.bin`,
      undefined,
    );

    // Add new pointer
    console.log("3. Adding new pointer");
    console.log("3.1. Adding new pointer entry");
    const newPointerEntry = new Uint8Array(255);
    newPointerEntry.set(new TextEncoder().encode(slug()));
    const pointers = await pointersPromise;
    if (!(pointers instanceof Uint8Array)) {
      throw new Error("Invalid pointers file type");
    }
    const newPointers = new Uint8Array(pointers.length + 255);
    newPointers.set(pointers);
    newPointers.set(newPointerEntry, pointers.length);

    pfs.writeFile(
      `${dir}/public/data/blog/pointer.bin`,
      newPointers,
      undefined,
    );

    console.log("3.2. Adding new pointer json");
    pfs.writeFile(
      `${dir}/public/data/blog/${slug()}.json`,
      JSON.stringify({
        title: title() || undefined,
        timestamp: now,
      }),
      undefined,
    );

    console.log("3.3. Adding new pointer html");
    if (content()) {
      pfs.writeFile(
        `${dir}/public/data/blog/${slug()}.html`,
        content(),
        undefined,
      );
    }

    console.log("3.4. Adding new pointer assets");

    const status = await git.statusMatrix({
      fs,
      dir,
			filter: (f) => f.startsWith('public/data/'),
    });
		const toStage = status.filter(x => !(x[1] === 1 && x[2] === 1 && x[3] === 1));
		console.log('To stage:', toStage);

    console.log("Done");
  };

  return (
    <div class="flex flex-1 flex-justify-center mt-8">
      <div class="flex flex-col max-w-275 w-75% gap-16 pb-8">
        <h1 class="text-3xl">Content Wizard</h1>
        <div class="flex flex-col gap-4">
          <div>
            <label>Title</label>
            <div class="text-black">
              <input
                class="outline-none border-none w-full p-2 bg-white text-black"
                type="text"
                required
                value={title()}
                onInput={(ev) => {
                  setTitle(ev.target.value);
                }}
              />
            </div>
          </div>
          <div>
            <label>Slug</label>
            <div class="text-black">
              <input
                class="outline-none border-none w-full p-2 bg-white text-black"
                type="text"
                required
                value={slug()}
                onInput={(ev) => {
                  const value = ev.target.value;
                  if (!value.match(/^[-a-z0-9]*$/)) {
                    ev.target.value = slug();
                    return;
                  }
                  setSlug(value);
                }}
              />
            </div>
          </div>
          <div>
            <label>Content</label>
            <div class="text-black">
              <div id="content-editor" ref={contentEditorRef} />
            </div>
          </div>
					<hr class="w-full" />
          <div>
            <label>Add to</label>
            <div>
              <input
                class="outline-none border-none w-full p-2 bg-white text-black"
                type="text"
                required
                list="category-list"
								value={category()}
								onChange={(ev) => {
									const val = ev.target.value;
									if (!categories.has(val)) {
										ev.target.value = category() ?? categories.keys().next().value;
										return;
									}
									setQueryParams({'category': val});
									setCategory(val);
								}}
              />
              <datalist id="category-list">
                <For each={Array.from(categories.entries())}>
                  {(item) => <option value={item[0]}>{item[1]}</option>}
                </For>
              </datalist>
            </div>
          </div>
        </div>
        <div>
          <button onClick={handleAddToEntry}>Add to Entry</button>
        </div>
      </div>
    </div>
  );
};

export default Wizard;
