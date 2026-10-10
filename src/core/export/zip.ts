/**
 * Lightweight, zero-dependency client-side ZIP builder.
 * Implements standard PKWARE ZIP format in memory.
 */
export interface ZipFileEntry {
  name: string;
  data: Uint8Array;
}

export function createZip(files: ZipFileEntry[]): Blob {
  const fileHeaders: Uint8Array[] = [];
  const centralDirectoryEntries: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = new TextEncoder().encode(file.name);
    const crc = crc32(file.data);
    const size = file.data.length;

    // Local file header (30 bytes + name)
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true); // signature
    lv.setUint16(4, 20, true);         // version needed
    lv.setUint16(6, 0, true);          // flags
    lv.setUint16(8, 0, true);          // compression (store)
    lv.setUint16(10, 0, true);         // mod time
    lv.setUint16(12, 0, true);         // mod date
    lv.setUint32(14, crc, true);       // crc32
    lv.setUint32(18, size, true);      // compressed size
    lv.setUint32(22, size, true);      // uncompressed size
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true);         // extra field len
    localHeader.set(nameBytes, 30);

    fileHeaders.push(localHeader, file.data);

    // Central directory header (46 bytes + name)
    const cdEntry = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(cdEntry.buffer);
    cv.setUint32(0, 0x02014b50, true); // signature
    cv.setUint16(4, 20, true);         // version made by
    cv.setUint16(6, 20, true);         // version needed
    cv.setUint16(8, 0, true);          // flags
    cv.setUint16(10, 0, true);         // compression (store)
    cv.setUint16(12, 0, true);         // mod time
    cv.setUint16(14, 0, true);         // mod date
    cv.setUint32(16, crc, true);       // crc32
    cv.setUint32(20, size, true);      // compressed size
    cv.setUint32(24, size, true);      // uncompressed size
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true);         // extra field len
    cv.setUint16(32, 0, true);         // comment len
    cv.setUint16(34, 0, true);         // disk num
    cv.setUint16(36, 0, true);         // internal attrs
    cv.setUint32(38, 0, true);         // external attrs
    cv.setUint32(42, offset, true);    // local header offset
    cdEntry.set(nameBytes, 46);

    centralDirectoryEntries.push(cdEntry);
    offset += localHeader.length + size;
  }

  const cdOffset = offset;
  let cdSize = 0;
  for (const c of centralDirectoryEntries) cdSize += c.length;

  // End of central directory record (22 bytes)
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);  // signature
  ev.setUint16(4, 0, true);           // disk number
  ev.setUint16(6, 0, true);           // start disk
  ev.setUint16(8, files.length, true); // disk entries
  ev.setUint16(10, files.length, true); // total entries
  ev.setUint32(12, cdSize, true);     // cd size
  ev.setUint32(16, cdOffset, true);   // cd offset
  ev.setUint16(20, 0, true);          // comment len

  const parts: Uint8Array[] = [...fileHeaders, ...centralDirectoryEntries, eocd];
  return new Blob(parts as any, { type: 'application/zip' });
}

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}
