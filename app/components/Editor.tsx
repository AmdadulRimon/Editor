import YooptaEditor, {
    createYooptaEditor,
    YooptaContentValue,
    YooptaOnChangeOptions,
  } from '@yoopta/editor';
  
  import Paragraph from '@yoopta/paragraph';
  import Blockquote from '@yoopta/blockquote';
  import Embed from '@yoopta/embed';
  import Image from '@yoopta/image';
  import Link from '@yoopta/link';
  import Callout from '@yoopta/callout';
  import Video from '@yoopta/video';
  import File from '@yoopta/file';
  import Accordion from '@yoopta/accordion';
  import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
  import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';
  import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
  import Code from '@yoopta/code';
  import Table from '@yoopta/table';
  import Divider from '@yoopta/divider';
  import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
  import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
  import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';
  import { useMemo, useRef, useState } from 'react';
  import { uploadToCloudinary } from '~/utils/cloudinary';
import { CarouselPlugin } from './withCustomPlugin/customPlugins/Carousel';
import { json, LoaderFunction } from '@remix-run/node';
import { connectToDB } from '~/utils/db.server';
import EditorContent from '~/module/models/editorContent';

  
  const plugins = [
    Paragraph,
    Table,
    CarouselPlugin,
    Divider.extend({
      elementProps: {
        divider: (props) => ({
          ...props,
          color: '#007aff',
        }),
      },
    }),
    Accordion,
    HeadingOne,
    HeadingTwo,
    HeadingThree,
    Blockquote,
    Callout,
    NumberedList,
    BulletedList,
    TodoList,
    Code,
    Link,
    Embed,
    Image.extend({
      options: {
         async onUpload (file) {
          if (!file) {
            console.error("No file received");
            return;
          }
    
          console.log("Uploading file:", file); // Check if file is received
    
          try {
            const data = await uploadToCloudinary(file, 'image');
            console.log("Upload response:", data); // Check response
    
            return {
              src: data.secure_url,
              alt: 'cloudinary',
              sizes: {
                width: data.width,
                height: data.height,
              },
            };
          } catch (error) {
            console.error("Image upload failed:", error); // Log upload error
            return null;
          }
        },
      },
    }),
    Video.extend({
      options: {
        onUpload: async (file) => {
          const data = await uploadToCloudinary(file, 'video');
          return {
            src: data.secure_url,
            alt: 'cloudinary',
            sizes: {
              width: data.width,
              height: data.height,
            },
          };
        },
        onUploadPoster: async (file) => {
          const image = await uploadToCloudinary(file, 'image');
          return image.secure_url;
        },
      },
    }),
    File.extend({
      options: {
        onUpload: async (file) => {
          const response = await uploadToCloudinary(file, 'auto');
          return { src: response.secure_url, format: response.format, name: response.name, size: response.bytes };
        },
      },
    }),
  ];
  
  const TOOLS = {
    ActionMenu: {
      render: DefaultActionMenuRender,
      tool: ActionMenuList,
    },
    Toolbar: {
      render: DefaultToolbarRender,
      tool: Toolbar,
    },
    LinkTool: {
      render: DefaultLinkToolRender,
      tool: LinkTool,
    },
  };
  
  const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];
  

const Editor = ({data}) => {
    const [value, setValue] = useState(data);
    const editor = useMemo(() => createYooptaEditor(), []);
    const selectionRef = useRef(null);
  
    const onChange = async (newValue: YooptaContentValue, options: YooptaOnChangeOptions) => {
      setValue(newValue);
      console.log(newValue);
      try {
        const response = await fetch("/api/save-editor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: newValue }),
        });
    
        const data = await response.json();
        if (data.success) {
          console.log("Editor content saved successfully");
        } else {
          console.error("Failed to save content:", data.error);
        }
      } catch (error) {
        console.error("Error sending data:", error);
      }
    };

  return   <div
  className="md:py-[100px] border md:pl-[200px] md:pr-[80px] px-[20px] pt-[80px] pb-[40px] flex justify-center"
  ref={selectionRef}
>
  <YooptaEditor
     width={672}
     editor={editor}
     plugins={plugins}
     tools={TOOLS}
     marks={MARKS}
     selectionBoxRoot={selectionRef}
     value={value}
     onChange={onChange}
     autoFocus
  />
</div>
};

export default Editor