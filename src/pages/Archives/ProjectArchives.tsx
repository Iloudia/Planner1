import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import PageHeading from "../../components/PageHeading"
import usePersistentState from "../../hooks/usePersistentState"
import "./ProjectArchives.css"

type ProjectStatus = "À commencer" | "En cours" | "Terminé"
type Priority = "Basse" | "Moyenne" | "Haute"
type Project = { id: string; title: string; status: ProjectStatus; image: string; description: string; startDate: string; targetDate: string; priority: Priority; archived: boolean }

const formatDate = (value: string) => value ? new Intl.DateTimeFormat("fr-FR").format(new Date(`${value}T00:00:00`)) : "—"

const ProjectArchives = () => {
  const [projects, setProjects] = usePersistentState<Project[]>("planner.project.workspace.v1", [])
  const [sort, setSort] = useState("recent")
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const archived = useMemo(() => projects.filter((project) => project.archived), [projects])
  const visibleProjects = useMemo(() => [...archived].sort((a, b) => sort === "oldest" ? a.targetDate.localeCompare(b.targetDate) : b.targetDate.localeCompare(a.targetDate)), [archived, sort])
  const restoreProject = (id: string) => setProjects((current) => current.map((project) => project.id === id ? { ...project, archived: false, status: "En cours" } : project))
  const deleteProject = (id: string) => setProjects((current) => current.filter((project) => project.id !== id))

  return <div className="project-archives-wrap">
    <PageHeading eyebrow="Projects" title="Projets archivés" />
    <div className="project-archives-page">
      <div className="project-archives__toolbar"><label>Trier par<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recent">Plus récent</option><option value="oldest">Plus ancien</option></select></label></div>
      <div className="project-archives__heading"><strong>{visibleProjects.length} projet{visibleProjects.length > 1 ? "s" : ""} archivé{visibleProjects.length > 1 ? "s" : ""}</strong><Link to="/project">Retour aux projets</Link></div>
      {visibleProjects.length ? <div className="project-archives__list">{visibleProjects.map((project) => <article key={project.id} className={selectedProjectId === project.id ? "is-selected" : ""} onClick={() => setSelectedProjectId(project.id)}><img src={project.image} alt="" /><div className="project-archives__content"><h2>{project.title}</h2><span className="project-archives__tag">{project.priority}</span><p>✓ Terminé</p></div><time>Archivé le<br /><b>{formatDate(project.targetDate)}</b></time><button type="button" onClick={(event) => { event.stopPropagation(); restoreProject(project.id) }}>Restaurer</button><button type="button" className="project-archives__delete" onClick={(event) => { event.stopPropagation(); deleteProject(project.id) }}>Supprimer définitivement</button></article>)}</div> : <p className="project-archives__empty">Aucun projet dans cette catégorie.</p>}
    </div>
  </div>
}

export default ProjectArchives
