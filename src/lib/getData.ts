import constants from "./constants";

export async function getData(path: string, offset: number, bytes: number) {
  return getFileBytes(getPathUsingEnvironment(path), offset, bytes);
  // return process.env.NODE_ENV === "development"
  //   ? getFileBytes(path, offset, bytes)
  //   : getRemoteBytes(path, offset, bytes);
}

async function getFileBytes(
  path: string,
  offset: number,
  bytes: number,
): Promise<[Uint8Array, Headers]> {
  // Github CORS makes it impossible for regular browsers to access Content-Range for some reason
  const responsePromises = [
    fetch(path, {
      method: "HEAD",
      cache: "no-cache",
    }),
    fetch(path, {
      headers: new Headers({
        Range: `bytes=${offset}-${offset + bytes}`,
      }),
    }),
  ];
  const [headRes, res] = await Promise.all(responsePromises);
  const bin = await res.arrayBuffer();
  return [new Uint8Array(bin), headRes.headers];
}

// async function getRemoteBytes(
//   path: string,
//   offset: number,
//   bytes: number,
// ): Promise<[Uint8Array, Headers]> {
//   const res = await fetch(`${getRemotePathPrefix()}${path}`, {
//     headers: new Headers({
//       Range: `bytes=${offset}-${offset + bytes}`,
//     }),
//   });
//   const bin = await res.arrayBuffer();
//   return [new Uint8Array(bin), res.headers];
// }

export function getPathUsingEnvironment(path: string) {
  return process.env.NODE_ENV === "development"
    ? path
    : `${getRemotePathPrefix()}${path}`;
}

function getRemotePathPrefix() {
  return "https://raw.githubusercontent.com/lrprawira/project-blog-portfolio-cms-fecundlie/master/public";
}

export function typedArrayToHexStringArray(arr: Uint8Array): Array<string> {
  return Array.from(arr).map((x) => x.toString(16));
}

export function compareUint8Array(arr1: Uint8Array, arr2: Uint8Array): number {
  if (arr1.length !== arr2.length) {
    return -2;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return i;
    }
  }

  return -1;
}

export function validateFormatHeader(arr: Uint8Array): void {
  class BPCFormatValidationException extends Error {}
  const magicNumber = arr.slice(0, 0x40);
  if (arr.length < 82) {
    throw new BPCFormatValidationException("Length is too small.");
  }
  const unmatchedMagicIndex = compareUint8Array(
    magicNumber,
    constants.formatMagic,
  );
  if (unmatchedMagicIndex !== -1) {
    const baseMsg = "Magic number is wrong.";
    if (unmatchedMagicIndex === -2) {
      throw new BPCFormatValidationException(
        `${baseMsg} Magic number length is wrong.`,
      );
    }
    throw new BPCFormatValidationException(
      `${baseMsg} Magic number at index ${unmatchedMagicIndex} is wrong. Expected ${constants.formatMagic[unmatchedMagicIndex]} got ${magicNumber[unmatchedMagicIndex]}.`,
    );
  }
  const entryPointer = arr.slice(81, 82)[0];
  if (entryPointer < 0x52) {
    throw new BPCFormatValidationException(
      "Entry Pointer cannot point to the header area.",
    );
  }
}

export function getDocId(arr: Uint8Array): number {
  return arr.slice(0x40, 0x41)[0];
}

export function getEntrySize(arr: Uint8Array): bigint {
  const entrySize = arr.slice(0x41, 0x49);
  return new DataView(entrySize.buffer, 0).getBigUint64(0, false);
}

export function getBitmasks(arr: Uint8Array): Array<boolean> {
  const eightBitArray = arr.slice(0x49, 0x51);
  const newArr = new Array<boolean>(64);
  for (let i = 0; i < 8; ++i) {
    for (let j = 0; j < 8; ++j) {
      newArr[i * 8 + (7 - j)] = Boolean(eightBitArray[i] & 1);
      eightBitArray[i] >>= 1;
    }
  }
  return newArr;
}

export function getEntryPointer(arr: Uint8Array): number {
  return arr.slice(0x51, 0x52)[0];
}

export function getPaginationByteRange(
  entryPointer: number = 0x52,
  entrySize: number,
  offsetNumberOfEntries: number,
  numberOfEntries: number,
  contentLength: number,
): [number, number, number] {
  const lastByte = contentLength - entrySize * offsetNumberOfEntries;
  if (lastByte < entryPointer) {
    return [-1, -1, -1];
  }
	const pages = Math.floor((contentLength - entryPointer) / (entrySize * numberOfEntries));
  for (let i = numberOfEntries; i > 0; --i) {
    const firstByte = lastByte - entrySize * i;
    if (firstByte >= entryPointer) {
      return [firstByte, lastByte, pages];
    }
  }
  return [-1, -1, -1];
}

export function trimTrailingNuls(arr: Uint8Array) {
  for (let i = arr.length - 1; i >= 0; --i) {
    if (arr[i] !== 0) {
      return arr.slice(0, i + 1);
    }
  }
}
