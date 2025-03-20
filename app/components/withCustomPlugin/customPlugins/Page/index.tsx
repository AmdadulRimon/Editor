import { YooptaPlugin } from "@yoopta/editor";
import { SeparatorHorizontal } from "lucide-react";
import { PageRenderElement } from "./renders/Page";
import FileText from "~/components/Editor/NotionExample/icons/FileText";

const PagePlugin = new YooptaPlugin({
  type: "Page",
  elements: {
    page: {
      render: PageRenderElement,
      asRoot:true,
      props: {
        title: "New Test Page",
        pageId: null,
        nodeType: "void",
      },
    },
  },
  options: {
    shortcuts: ["/page"],
    display: {
      title: "Page",
      description: "Insert a new page block",
      icon: <FileText />,
    },
  },
});

export { PagePlugin };
