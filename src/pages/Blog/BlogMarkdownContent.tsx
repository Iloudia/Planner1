import { Fragment, type ReactNode } from "react"

const renderInline = (text: string, keyPrefix: string): ReactNode[] =>
  text.split(/(\*\*.*?\*\*|\[[^\]]+\]\([^)]+\)|<br\s*\/?\s*>)/gi).filter(Boolean).map((part, index) => {
    if (/^<br\s*\/?\s*>$/i.test(part)) return <br key={`${keyPrefix}-${index}`} />
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-${index}`}>{part.slice(2, -2)}</strong>
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) {
      return <a href={link[2]} key={`${keyPrefix}-${index}`} rel="noreferrer" target="_blank">{link[1]}</a>
    }
    return <Fragment key={`${keyPrefix}-${index}`}>{part}</Fragment>
  })

const isBlockStart = (line: string) => /^(#{1,3})\s/.test(line) || line === "---" || /^[-*]\s/.test(line)

const BlogMarkdownContent = ({ content }: { content: string }) => {
  const lines = content.replace(/\r/g, "").split("\n")
  const blocks: ReactNode[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index].trim()
    if (!line) {
      index += 1
      continue
    }
    if (line === "---") {
      blocks.push(<hr key={`separator-${index}`} />)
      index += 1
      continue
    }
    const heading = line.match(/^(#{1,3})\s+(.+)$/)
    if (heading) {
      const children = renderInline(heading[2], `heading-${index}`)
      blocks.push(heading[1].length === 3
        ? <h3 key={`heading-${index}`}>{children}</h3>
        : <h2 key={`heading-${index}`}>{children}</h2>)
      index += 1
      continue
    }
    if (/^[-*]\s/.test(line)) {
      const items: string[] = []
      while (index < lines.length && /^[-*]\s/.test(lines[index].trim())) {
        items.push(lines[index].trim().slice(2))
        index += 1
      }
      blocks.push(
        <ul key={`list-${index}`}>
          {items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item, `list-${index}-${itemIndex}`)}</li>)}
        </ul>,
      )
      continue
    }
    const paragraphLines = [line]
    index += 1
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index].trim())) {
      paragraphLines.push(lines[index].trim())
      index += 1
    }
    blocks.push(<p key={`paragraph-${index}`}>{renderInline(paragraphLines.join(" "), `paragraph-${index}`)}</p>)
  }

  return <>{blocks}</>
}

export default BlogMarkdownContent
