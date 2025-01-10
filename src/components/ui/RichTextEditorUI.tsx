import React, { useEffect, useRef } from "react";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Link from "@tiptap/extension-link";
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaHighlighter, FaUndo, FaRedo, FaLink, FaUnlink } from "react-icons/fa";
import { MdFormatAlignLeft, MdFormatAlignCenter, MdFormatAlignRight, MdFormatAlignJustify } from "react-icons/md";
import { AiOutlineOrderedList, AiOutlineUnorderedList } from "react-icons/ai";
import { Button } from "@mantine/core";
import Placeholder from '@tiptap/extension-placeholder';

const RichTextEditorUI = ({setAdditionalTerms,content}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Strike,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Superscript,
      Subscript,
      BulletList,
      OrderedList,
      ListItem,
      Link.configure({ openOnClick: true }),
      Placeholder.configure({ placeholder: 'Enter your Additional terms here' }) // Add placeholder here
    ],
    content: content,
  });

  const editorRef = useRef(null); // Reference to the editor container
  const isRTL = (text) => {
    const rtlChars = /[\u0590-\u08ff\uFB1D-\uFDFD\uFE70-\uFEFC]/; // Hebrew, Arabic, and other RTL characters range
    return rtlChars.test(text);
  };
 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editorRef.current && !editorRef.current.contains(event.target)) {
        let htmlContent = editor.getHTML();
  
        // Check if the content is RTL
        if (isRTL(htmlContent)) {
          // Apply RTL direction to the editor content
          editorRef.current.querySelector('.ProseMirror').style.direction = "rtl";
          editor.chain().setTextAlign("right").run();
  
          // Add RTL styles to <ul>, <ol>, and <li>
          htmlContent = htmlContent.replace(/<(ol|ul)([^>]*)>/g, '<$1$2 style="direction: rtl;">');
          htmlContent = htmlContent.replace(/<li([^>]*)>/g, '<li$1 style="direction: rtl;">');
          htmlContent = htmlContent.replace(/<p([^>]*)>/g, '<p$1 style="direction: rtl;">');
        } else {
          // Apply LTR direction to the editor content
          editorRef.current.querySelector('.ProseMirror').style.direction = "ltr";
          editor.chain().setTextAlign("left").run();
  
          // Add LTR styles to <ul>, <ol>, and <li>
          htmlContent = htmlContent.replace(/<(ol|ul)([^>]*)>/g, '<$1$2 style="direction: ltr;">');
          htmlContent = htmlContent.replace(/<li([^>]*)>/g, '<li$1 style="direction: ltr;">');
          htmlContent = htmlContent.replace(/<p([^>]*)>/g, '<p$1 style="direction: ltr;">');
        }
  
        // Format the HTML for proper nesting
        htmlContent = htmlContent.replace(/<\/li>/g, "</li>\n");
        htmlContent = htmlContent.replace(/<\/ul>/g, "</ul>\n");
        htmlContent = htmlContent.replace(/<\/ol>/g, "</ol>\n");
  
        // Log the formatted content
        console.log("Editor content:", htmlContent);
  
        // Set the updated content
        setAdditionalTerms(htmlContent);
      }
    };
  handleClickOutside("click")
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [editor,content]);
  
  if (!editor) {
    return null;
  }

  const addLink = () => {
    let url = window.prompt("Enter the URL");
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    if (url) {
      // Remove any existing link before setting the new one
      editor.chain().focus().unsetLink().run();
      
      // Apply the new link to the selected text
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  return (
    <div ref={editorRef} style={{ border: "1px solid black", marginBottom: "15px", borderRadius: "0.75rem" }}>
      {/* Toolbar */}
      <style>
        {`
          ol {
            list-style-type: decimal;
            margin-left: 20px;
          }
          ul {
            list-style-type: disc;
            margin-left: 20px;
          }
          li {
            margin-bottom: 5px;
          }
        `}
      </style>
      <div
        style={{
          display: "flex",
          gap: "5px",
          alignItems: "center",
          flexWrap: "wrap",
          border: "1px solid black",
          borderRadius: "0.75rem 0.75rem 0 0",
        }}
      >
        <Button onClick={() => editor.chain().focus().toggleBold().run()} variant="subtle">
          <FaBold />
        </Button>
        <Button onClick={() => editor.chain().focus().toggleItalic().run()} variant="subtle">
          <FaItalic />
        </Button>
        <Button onClick={() => editor.chain().focus().toggleUnderline().run()} variant="subtle">
          <FaUnderline />
        </Button>
        <Button onClick={() => editor.chain().focus().toggleStrike().run()} variant="subtle">
          <FaStrikethrough />
        </Button>
        <Button onClick={() => editor.chain().focus().toggleHighlight().run()} variant="subtle">
          <FaHighlighter />
        </Button>
        <Button onClick={() => editor.chain().focus().toggleBulletList().run()} variant="subtle">
          <AiOutlineUnorderedList />
        </Button>
        <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} variant="subtle">
          <AiOutlineOrderedList />
        </Button>
        <Button onClick={() => editor.chain().focus().setTextAlign("left").run()} variant="subtle">
          <MdFormatAlignLeft />
        </Button>
        <Button onClick={() => editor.chain().focus().setTextAlign("center").run()} variant="subtle">
          <MdFormatAlignCenter />
        </Button>
        <Button onClick={() => editor.chain().focus().setTextAlign("right").run()} variant="subtle">
          <MdFormatAlignRight />
        </Button>
        <Button onClick={() => editor.chain().focus().setTextAlign("justify").run()} variant="subtle">
          <MdFormatAlignJustify />
        </Button>
        <Button onClick={() => editor.chain().focus().undo().run()} variant="subtle">
          <FaUndo />
        </Button>
        <Button onClick={() => editor.chain().focus().redo().run()} variant="subtle">
          <FaRedo />
        </Button>
        <Button onClick={addLink} variant="subtle">
          <FaLink />
        </Button>
        <Button onClick={() => editor.chain().focus().unsetLink().run()} variant="subtle">
          <FaUnlink />
        </Button>
        <Button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} variant="subtle">
          H1
        </Button>
        <Button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} variant="subtle">
          H2
        </Button>
        <Button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} variant="subtle">
          H3
        </Button>
        <Button onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} variant="subtle">
          H4
        </Button>
      </div>

      {/* RichTextEditor Component */}
      <RichTextEditor editor={editor} style={{ border: "none !important" }}>
        <RichTextEditor.Content />
      </RichTextEditor>
    </div>
  );
};

export default RichTextEditorUI;
