// app/routes/api/newPage.ts
import { EditorContent } from "~/module/editor/model";
import { json } from "@remix-run/node";

export const action = async () => {
  try {
    const result = await EditorContent.create({ title: 'Untitled', content: {} });
    return json({ id: result._id }); // Return the ID as JSON
  } catch (error) {
    console.error("Error creating page:", error);
    return json({ error: "Failed to create page" }, { status: 500 });
  }
};