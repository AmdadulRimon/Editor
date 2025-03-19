import { YooptaPlugin } from '@yoopta/editor';
import { FilePlusIcon } from 'lucide-react';
import { Link } from '@remix-run/react';
import { useFetcher } from '@remix-run/react';

const PageComponent = ({ attributes, children, element }) => {
  const { id } = element.props;

  return (
    <div {...attributes} contentEditable={false}>
      <Link to={`/dashboard/content/${id}`} className="text-blue-500 underline">
        {`Open Page ${id}`}
      </Link>
    </div>
  );
};

const PagePlugin = new YooptaPlugin({
  type: 'Page',
  elements: {
    page: {
      render: PageComponent,
      props: {
        id: "67da7bc163504578dfa1c133",
      },
    },
  },
  options: {
    display: {
      title: 'Page',
      description: 'Create a new page',
      icon: <FilePlusIcon size={24} />,
    },
    shortcuts: ['page'],
  },
  commands: {
    create: ({ editor, trigger }) => {
      const fetcher = useFetcher(); // Use Remix's useFetcher hook

      const createPage = async () => {
        fetcher.submit(
          {}, // No form data needed
          { method: 'POST', action: '/api/newPage' } // Submit to the action
        );
      };

      // Listen for fetcher data changes
      if (fetcher.data?.id) {
        const newPageId = fetcher.data.id;
        const pageNode = {
          type: 'page',
          props: {
            id: newPageId,
          },
          children: [{ text: `Open Page ${newPageId}` }],
        };
        editor.insertNode(pageNode); // Insert the page link into the editor
      }

      // Execute the page creation process
      createPage();
    },
  },
});

export { PagePlugin };