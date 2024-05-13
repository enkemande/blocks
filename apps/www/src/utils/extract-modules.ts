export const extractModules = (dataString: string) => {
  const modules = [];
  const regex =
    /require\(['"](.+?)['"]\)|import\s+(\w+|{[\s\S]*?})\s+from\s+['"](.+?)['"]/g;

  let match;
  while ((match = regex.exec(dataString)) !== null) {
    const modulePath = match[1] || match[3];
    modules.push(modulePath);
  }
  return modules as string[];
};
