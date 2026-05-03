import path from 'path';

/**
 * Object path inside the bucket from a public or signed GCS URL (for delete(), etc.).
 */
export function gcsObjectNameFromFileUrl(fileUrl, bucketName) {
  try {
    const u = new URL(fileUrl);
    const p = decodeURIComponent(u.pathname);
    const m = p.match(/^\/([^/]+)\/(.+)$/);
    if (!m) return path.basename(String(fileUrl).split('?')[0]);
    const [, urlBucket, objectKey] = m;
    if (urlBucket !== bucketName) return objectKey;
    return objectKey;
  } catch {
    return path.basename(String(fileUrl).split('?')[0]);
  }
}

/**
 * Returns a URL the browser can load (e.g. <img src>).
 * Tries public ACL first; falls back to a long-lived signed URL if the bucket uses uniform access.
 */
export async function gcsFileToReadableUrl(gcsFile) {
  const bucketName = gcsFile.bucket.name;
  try {
    await gcsFile.makePublic();
  } catch {
    const [url] = await gcsFile.getSignedUrl({
      version: 'v2',
      action: 'read',
      expires: new Date('2100-01-01'),
    });
    return url;
  }
  const encodedPath = gcsFile.name.split('/').map(encodeURIComponent).join('/');
  return `https://storage.googleapis.com/${bucketName}/${encodedPath}`;
}
