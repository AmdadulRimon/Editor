import { PluginElementRenderProps } from '@yoopta/editor';
import FileText from '~/components/Editor/NotionExample/icons/FileText';

const PageRenderElement = ({ attributes, children }: PluginElementRenderProps) => {
  return (
    <div {...attributes} className="w-full flex relative items-center my-1 cursor-pointer" contentEditable={false}>
     <FileText/> New Page
    </div>
  );
};

export { PageRenderElement };
