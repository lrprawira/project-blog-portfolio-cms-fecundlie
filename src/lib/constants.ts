const sidebarEntryDataFactory = (args: {
  name?: string;
  target?: string;
  prefix?: string;
  type?: "link" | "text" | "separator";
  indented?: boolean;
}) => {
  const {
    name,
    target = "",
    prefix = "/",
    type = "link",
    indented = false,
  } = args;

  return {
    name,
    target: `${prefix}${target ?? ""}`,
    type,
    indented,
  };
};

const FORMAT_MAGIC = new Uint8Array([
  0x00, 0x00, 0x00, 0x00, 0x44, 0x6f, 0x63, 0x75, 0x6d, 0x65, 0x6e, 0x74, 0x00,
  0x50, 0x6f, 0x69, 0x6e, 0x74, 0x65, 0x72, 0x00, 0x42, 0x69, 0x6e, 0x61, 0x72,
  0x79, 0x00, 0x46, 0x6f, 0x72, 0x6d, 0x61, 0x74, 0x00, 0x34, 0x00, 0x50, 0x72,
  0x6f, 0x6a, 0x65, 0x63, 0x74, 0x00, 0x42, 0x50, 0x43, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
]);

const pointers = {
  formatMagic: FORMAT_MAGIC,
  title: "Lie Fecund",
  favicon:
    "https://d37b3blifa5mva.cloudfront.net/000_clients/716643/file/32x32-716643ROvugApx.ico",
  sidebarHomeImage:
    "https://d37b3blifa5mva.cloudfront.net/000_clients/716643/file/716643AYnUy4aM.png",
  contacts: {
    email: "fecundlie@yahoo.com",
    instagram: "https://www.instagram.com/fecundlie/",
    linkedin: "https://www.linkedin.com/in/fecundlie/",
    behance: "https://www.behance.net/Fecundlie",
    pinterest: "https://www.pinterest.com/fecundlie/",
  },
  sidebarList: [
    sidebarEntryDataFactory({ name: "About Me", target: "about-me" }),
    sidebarEntryDataFactory({ type: "separator" }),
    sidebarEntryDataFactory({ name: "Personal Blog", target: "personal-blog" }),
    sidebarEntryDataFactory({ type: "separator" }),
    sidebarEntryDataFactory({ name: "3D Works", type: "text" }),
    sidebarEntryDataFactory({
      name: "Hai Dudu",
      prefix: "/portfolio/",
      target: "hai-dudu",
      indented: true,
    }),
    sidebarEntryDataFactory({
      name: "Momotaro - AR Game",
      prefix: "/portfolio/",
      target: "momotaro",
      indented: true,
    }),
    sidebarEntryDataFactory({
      name: "MCI - Singapore",
      prefix: "/portfolio/",
      target: "mci-sg",
      indented: true,
    }),
    sidebarEntryDataFactory({ type: "separator" }),
    sidebarEntryDataFactory({ name: "2D Works", type: "text" }),
    sidebarEntryDataFactory({
      name: "NCS - IOT",
      prefix: "/portfolio/",
      target: "ncs-iot",
      indented: true,
    }),
    sidebarEntryDataFactory({ type: "separator" }),
    sidebarEntryDataFactory({ name: "Personal Artworks", type: "text" }),
    sidebarEntryDataFactory({
      name: "NFT Fanart",
      prefix: "/portfolio/",
      target: "nft-fanart",
      indented: true,
    }),
  ],
  blogEntries: new Map([["hantu-lokal", null]]),
};

export const categories = new Map();
categories.set('personal-blog', 'Personal Blog');
categories.set('3d-works', '3D Works');
categories.set('2d-works', '2D Works');
categories.set('personal-artworks', 'Personal Artworks');

export const POINTER_BIN_FILE = 'pointer.bin';
export const PERSONAL_BLOG_PATH = 'public/data/personal-blog';
export const VFS_PREFIX = '/repo';

export default pointers;
