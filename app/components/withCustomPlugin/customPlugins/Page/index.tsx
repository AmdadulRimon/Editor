import { YooptaPlugin } from '@yoopta/editor';
import { FileText } from 'lucide-react';
import { PageRenderElement } from './renders/Page';

const PagePlugin = new YooptaPlugin({
  type: 'Page',
  elements: {
    divider: {
      render: PageRenderElement,
      props: {
        nodeType: 'void',
      },
    },
  },
  options: {
    shortcuts: ['<--', '<---'],
    display: {
      title: 'New Page',
      description: 'Separate',
      icon: <FileText/>,
    },
  },
});

export { PagePlugin };
