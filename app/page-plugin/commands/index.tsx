import { generateId, SlateEditor, YooEditor } from "@yoopta/editor";
import { Editor, Element, Location, Transforms } from "slate";
import { PageLinkElement, PageLinkElementProps } from "../types";

type PageLinkElementOptions = {
  props: Omit<PageLinkElementProps, "nodeType">;
};

type PageLinkInsertOptions = PageLinkElementOptions & {
  selection?: Location | undefined;
  slate: SlateEditor;
};

type DeleteElementOptions = {
  slate: SlateEditor;
};

export type PageLinkCommands = {
  buildPageLinkElement: (
    editor: YooEditor,
    options: PageLinkElementOptions
  ) => PageLinkElement;
  insertPageLink: (editor: YooEditor, options: PageLinkInsertOptions) => void;
  deletePageLink: (editor: YooEditor, options: DeleteElementOptions) => void;
};

export const PageLinkCommands: PageLinkCommands = {
  buildPageLinkElement: (editor, options) => {
    const { props } = options || {};
    // Create page link props using the provided title and pageId
    const pageLinkProps: PageLinkElementProps = {
      ...props,
      nodeType: "inline", // Keep inline formatting for links
    };
    return {
      id: generateId(),
      type: "pageLink", // Updated element type for internal page links
      children: [{ text: props?.title || "Untitled Page" }],
      props: pageLinkProps,
    } as PageLinkElement;
  },
  insertPageLink: (editor, options) => {
    let { props, slate } = options || {};

    if (!slate || !slate.selection) return;

    // Get any text in the selection as a fallback title.
    const textInSelection = Editor.string(slate, slate.selection);

    // If this is a new internal page link (e.g. via a /page command),
    // generate a new pageId if one is not already provided.
    const pageId = props.pageId || generateId();

    const pageLinkProps: PageLinkElementProps = {
      ...props,
      title: props.title || textInSelection || "Untitled Page",
      pageId,
      nodeType: "inline",
    };

    // Build a new page link element with our updated properties.
    const pageLinkElement = PageLinkCommands.buildPageLinkElement(editor, {
      props: pageLinkProps,
    });

    // Check if a pageLink element already exists in the current selection.
    const [existingPageLinkEntry] = Editor.nodes(slate, {
      at: slate.selection,
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === "pageLink",
    });

    if (existingPageLinkEntry) {
      const [existingPageLink, path] = existingPageLinkEntry;
      // Update the properties of the existing page link.
      Transforms.setNodes(
        slate,
        {
          props: {
            ...existingPageLink.props,
            ...pageLinkProps,
            nodeType: "inline",
          },
        },
        {
          match: (n) => Element.isElement(n) && n.type === "pageLink",
          at: path,
        }
      );
      // Update the text content to reflect the new title.
      Editor.insertText(slate, pageLinkProps.title, { at: slate.selection });
      Transforms.collapse(slate, { edge: "end" });
      return;
    }

    // Wrap the selected nodes with the new page link element.
    Transforms.wrapNodes(slate, pageLinkElement, {
      split: true,
      at: slate.selection,
    });
    // Set the child text for the link element.
    Transforms.setNodes(
      slate,
      { text: pageLinkProps.title },
      {
        at: slate.selection,
        mode: "lowest",
        match: (n) =>
          !Editor.isEditor(n) && Element.isElement(n) && n.type === "pageLink",
      }
    );
    Editor.insertText(slate, pageLinkProps.title, { at: slate.selection });
    Transforms.collapse(slate, { edge: "end" });
  },
  deletePageLink: (editor, options) => {
    try {
      const { slate } = options;
      if (!slate || !slate.selection) return;

      const [pageLinkNodeEntry] = Editor.nodes(slate, {
        at: slate.selection,
        match: (n) =>
          !Editor.isEditor(n) && Element.isElement(n) && n.type === "pageLink",
      });

      if (pageLinkNodeEntry) {
        // Unwrap the page link element. This removes the link formatting
        // without deleting the underlying page content.
        Transforms.unwrapNodes(slate, {
          match: (n) =>
            !Editor.isEditor(n) &&
            Element.isElement(n) &&
            n.type === "pageLink",
          at: slate.selection,
        });
      }
    } catch (error) {
      // Optionally handle or log errors here.
    }
  },
};
