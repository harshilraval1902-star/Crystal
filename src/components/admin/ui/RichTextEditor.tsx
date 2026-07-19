import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Heading2 } from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null
  }

  const addImage = () => {
    const url = window.prompt('URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const buttonClass = (active: boolean) => 
    `p-2 rounded-md hover:bg-gray-100 transition-colors ${active ? 'bg-gray-100 text-primary-600' : 'text-gray-600'}`;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 p-2 bg-gray-50/50 rounded-t-md">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClass(editor.isActive('bold'))}>
        <Bold className="h-4 w-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClass(editor.isActive('italic'))}>
        <Italic className="h-4 w-4" />
      </button>
      <div className="w-px h-4 bg-gray-300 mx-1" />
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={buttonClass(editor.isActive('heading', { level: 2 }))}>
        <Heading2 className="h-4 w-4" />
      </button>
      <div className="w-px h-4 bg-gray-300 mx-1" />
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonClass(editor.isActive('bulletList'))}>
        <List className="h-4 w-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonClass(editor.isActive('orderedList'))}>
        <ListOrdered className="h-4 w-4" />
      </button>
      <div className="w-px h-4 bg-gray-300 mx-1" />
      <button type="button" onClick={setLink} className={buttonClass(editor.isActive('link'))}>
        <LinkIcon className="h-4 w-4" />
      </button>
      <button type="button" onClick={addImage} className={buttonClass(false)}>
        <ImageIcon className="h-4 w-4" />
      </button>
    </div>
  )
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4 bg-white',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Update editor content if value changes externally (e.g. data loaded)
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 transition-colors">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
