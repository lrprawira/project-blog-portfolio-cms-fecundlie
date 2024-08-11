import { nanoid } from "nanoid";
import { createWithSignal } from "solid-zustand";
import { persist } from "zustand/middleware";

interface AdminState {
  asAdmin: boolean;
  enableAdmin: () => void;
  disableAdmin: () => void;
  toggleAdmin: () => void;
}

const useAdminStore = createWithSignal<
  AdminState,
  [["zustand/persist", AdminState]]
>(
  persist(
    (set, get) => ({
      asAdmin: false,
      enableAdmin: () => set({ asAdmin: true }),
      disableAdmin: () => set({ asAdmin: false }),
      toggleAdmin: () => set({ asAdmin: !get().asAdmin }),
    }),
    {
      name: "admin-zustand-store",
    },
  ),
);

interface ContentState {
  type: string;
	originSlug: string;
	setEditType: (slug?: string) => void;
	title: string;
	slug: string;
	content: string;
	assets: Record<string, Blob>;
	setTitle: (x: string) => void;
	setSlug: (x:string) => void;
	setContent: (x: string) => void;
	addAsset: (x: Blob) => string;
	removeAsset: (x: string) => void;
}

const useContentStore = createWithSignal<
  ContentState,
  [["zustand/persist", ContentState]]
>(
  persist(
    (set, get) => ({
      type: "edit",
			originSlug: "",
			title: "",
			slug: "",
			content: "",
			assets: {},
			setEditType: (slug) => {
				if (!slug) {
					return set({
						type: "new",
						originSlug: "",
					});
				}
				return set({
					type: "edit",
					originSlug: slug,
					slug: get().slug || slug,
				});
			},
			setTitle: (x) => set({ title: x }),
			setSlug: (x) => set({ slug: x }),
			setContent: (x) => set({ content: x }),
			addAsset: (x) => {
				const assetID = nanoid();
				set({
					assets: {
					...get().assets,
					[assetID]: x,
					}
				});
				return assetID;
			},
			removeAsset: (x) => {
				const assets = get().assets;
				delete assets[x];
				set({
					assets
				});
			},
    }),
    {
      name: "content-zustand-store",
    },
  ),
);

export { useAdminStore, useContentStore };
