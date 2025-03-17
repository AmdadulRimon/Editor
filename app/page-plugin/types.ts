// types.ts

export interface PageLinkElementProps {
  title: string;  // The display title for the internal page link
  pageId: string; // A unique identifier for the linked internal page
  nodeType: string; // Should always be set to 'inline'
}

export interface PageLinkElement {
  id: string; // Unique identifier for the element instance
  type: 'pageLink'; // Defines the element as an internal page link
  children: Array<{ text: string }>; // The text content of the link
  props: PageLinkElementProps; // Additional properties for the link
}
