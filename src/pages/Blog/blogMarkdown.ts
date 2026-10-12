export const getMarkdownTitle = (markdown: string) => {
  const titleLine = markdown.replace(/\r/g, "").split("\n").find((line) => line.startsWith("# "))
  return titleLine?.slice(2).trim() ?? ""
}

export const getMarkdownBody = (markdown: string) => {
  const lines = markdown.replace(/\r/g, "").split("\n")
  const titleIndex = lines.findIndex((line) => line.startsWith("# "))
  return titleIndex >= 0 ? lines.slice(titleIndex + 1).join("\n").trim() : markdown.trim()
}

export const buildArticleMarkdown = (title: string, body: string) => `# ${title.trim()}\n\n${body.trim()}`
