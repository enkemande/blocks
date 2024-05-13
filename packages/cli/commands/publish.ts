import { readBlock } from "@/utils/block";
import { createFolderFormData } from "@/utils/create-folder-form-data";
import { handleError } from "@/utils/handle-error";
import { http } from "@/utils/http";
import { Command } from "commander";
import FormData from "form-data";

export const publish = new Command()
  .name("publish")
  .description("add a component to your project")
  .argument("[blockNames...]", "the blocks to add")
  .action(async (blockNames: string[]) => {
    try {
      for (const blockName of blockNames) {
        const block = await readBlock(blockName);
        const formData = new FormData();
        formData.append("name", block.name);
        formData.append("description", block.description);
        createFolderFormData(block.path, formData);
        await http.post("/api/blocks/publish", formData, {
          headers: { ...formData.getHeaders() },
        });
      }
    } catch (error) {
      handleError(error);
    }
  });
