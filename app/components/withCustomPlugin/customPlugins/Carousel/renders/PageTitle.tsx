import { PluginElementRenderProps } from '@yoopta/editor';
import FileText from '~/components/Editor/NotionExample/icons/FileText';

const PageTitle = (props: PluginElementRenderProps) => {
  return (
    <h4 {...props.attributes} className="w-full font-semibold leading-none tracking-tight my-[8px]">
      <FileText/> New Page
    </h4>
  );
};

export { PageTitle };
