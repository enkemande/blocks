export const extractModulesFromFile = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const arrayBufferToString = Buffer.from(arrayBuffer).toString();
  const modules = [];
  const regex =
    /require\(['"](.+?)['"]\)|import\s+(\w+|{[\s\S]*?})\s+from\s+['"](.+?)['"]/g;

  let match;
  while ((match = regex.exec(arrayBufferToString)) !== null) {
    const modulePath = match[1] || match[3];
    modules.push(modulePath);
  }
  return modules as string[];
};
