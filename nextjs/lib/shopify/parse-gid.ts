export default function parseGid(gid: string) {
  if (!gid?.includes('/')) return { id: gid, type: undefined };

  const arr = gid.split('/');
  const id = arr[arr.length - 1];
  const type = arr[arr.length - 2];

  return { id, type };
}
