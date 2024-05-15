"use client";

export const Upload = () => {
  const handleFileUpload = (event: any) => {
    const fileList = event.target.files;
    Array.from(fileList).forEach((file: any) => {
      if (file.isDirectory) {
        // Handle directory
        handleDirectory(file);
      } else {
        // Handle file
        handleSingleFile(file);
      }
    });
  };

  const handleDirectory = (directory: any) => {
    // Handle directory and its contents recursively
    const reader = directory.createReader();
    reader.readEntries((entries: any) => {
      entries.forEach((entry: any) => {
        console.log(entry);
        if (entry.isDirectory) {
          handleDirectory(entry);
        } else {
          handleSingleFile(entry);
        }
      });
    });
  };

  const handleSingleFile = (file: any) => {
    // Handle individual file
    console.log(file);
  };

  return (
    <input
      onChange={handleFileUpload}
      type="file"
      directory=""
      webkitdirectory=""
    />
  );
};
