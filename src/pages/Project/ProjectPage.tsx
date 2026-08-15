import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react"
import { Link } from "react-router-dom"
import usePersistentState from "../../hooks/usePersistentState"
import PageHeading from "../../components/PageHeading"
import projectMoodboard from "../../assets/Moodboardsite.png"
import "./ProjectPage.css"

type ProjectStatus = "À commencer" | "En cours" | "Terminé"
type TaskStatus = "À faire" | "En cours" | "Terminée"
type Priority = "Basse" | "Moyenne" | "Haute"

type ProjectTask = { id: string; title: string; status: TaskStatus; dueDate: string; priority: Priority }
type ProjectResource = { id: string; title: string; url: string }
type ProjectAttachment = { id: string; name: string; url: string }
type Project = {
  id: string
  title: string
  status: ProjectStatus
  image: string
  description: string
  startDate: string
  targetDate: string
  priority: Priority
  tasks: ProjectTask[]
  resources: ProjectResource[]
  attachments: ProjectAttachment[]
  notes: string
  archived: boolean
}

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const initialProjects: Project[] = [{
  id: "project-example",
  title: "Refonte de mon site web",
  status: "En cours",
  image: projectMoodboard,
  description: "Refondre entièrement mon site web pour le rendre plus moderne, rapide et aligné avec mon univers de marque.",
  startDate: "2024-05-01",
  targetDate: "2024-06-30",
  priority: "Haute",
  tasks: [],
  resources: [],
  attachments: [],
  notes: "",
  archived: false,
}]

const statusClassName = (status: ProjectStatus) => {
  if (status === "À commencer") return "project-status--a-commencer"
  if (status === "Terminé") return "project-status--termine"
  return "project-status--en-cours"
}

const priorityClassName = (priority: Priority) => `project-priority--${priority.toLowerCase()}`
const formatDate = (value: string) => (value ? new Intl.DateTimeFormat("fr-FR").format(new Date(`${value}T00:00:00`)) : "—")
const faviconUrl = (url: string) => {
  try {
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(new URL(url).hostname)}&sz=32`
  } catch {
    return ""
  }
}
const projectProgress = (project: Project) => {
  if (project.status === "Terminé") return 100
  if (project.tasks.length === 0) return 0
  return Math.round((project.tasks.filter((task) => task.status === "Terminée").length / project.tasks.length) * 100)
}

const ProjectPage = () => {
  const [projects, setProjects] = usePersistentState<Project[]>("planner.project.workspace.v1", initialProjects)
  const [selectedProjectId, setSelectedProjectId] = useState(() => projects[0]?.id ?? null)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false)
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null)
  const [openResourceMenuId, setOpenResourceMenuId] = useState<string | null>(null)
  const [openAttachmentMenuId, setOpenAttachmentMenuId] = useState<string | null>(null)
  const [newProject, setNewProject] = useState({ title: "", status: "À commencer" as ProjectStatus, description: "", startDate: "", targetDate: "", priority: "Moyenne" as Priority, image: projectMoodboard })
  const [newTask, setNewTask] = useState({ title: "", status: "À faire" as TaskStatus, dueDate: "", priority: "Moyenne" as Priority })
  const [newResource, setNewResource] = useState({ title: "", url: "" })
  const [attachmentError, setAttachmentError] = useState("")
  const [previewAttachment, setPreviewAttachment] = useState<ProjectAttachment | null>(null)

  useEffect(() => {
    const handleOutsideMenu = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.closest(".profile-menu") || target?.closest(".account-menu__panel")) return
      setOpenResourceMenuId(null)
      setOpenAttachmentMenuId(null)
    }
    window.addEventListener("pointerdown", handleOutsideMenu)
    return () => window.removeEventListener("pointerdown", handleOutsideMenu)
  }, [])

  const activeProjects = projects.filter((project) => !project.archived)
  const archivedProjects = projects.filter((project) => project.archived)
  const selectedProject = activeProjects.find((project) => project.id === selectedProjectId) ?? activeProjects[0] ?? null
  const stats = useMemo(() => ({
    inProgress: activeProjects.filter((project) => project.status === "En cours").length,
    pending: activeProjects.filter((project) => project.status === "À commencer").length,
    completed: archivedProjects.length,
  }), [activeProjects, archivedProjects, projects.length])


  const updateSelectedProject = (update: (project: Project) => Project) => {
    if (!selectedProject) return
    setProjects((currentProjects) => currentProjects.map((project) => project.id === selectedProject.id ? update(project) : project))
  }

  const handleProjectImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const image = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Image invalide"))
      reader.onerror = () => reject(new Error("Image invalide"))
      reader.readAsDataURL(file)
    }).catch(() => projectMoodboard)
    setNewProject((current) => ({ ...current, image }))
  }

  const handleProjectSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!newProject.title.trim()) return
    const project: Project = { id: createId(), title: newProject.title.trim(), status: newProject.status, image: newProject.image, description: newProject.description.trim(), startDate: newProject.startDate, targetDate: newProject.targetDate, priority: newProject.priority, tasks: [], resources: [], attachments: [], notes: "", archived: false }
    setProjects((currentProjects) => [...currentProjects, project])
    setSelectedProjectId(project.id)
    setNewProject({ title: "", status: "À commencer", description: "", startDate: "", targetDate: "", priority: "Moyenne", image: projectMoodboard })
    setIsProjectModalOpen(false)
  }

  const handleTaskSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!newTask.title.trim()) return
    updateSelectedProject((project) => ({ ...project, tasks: [...project.tasks, { id: createId(), title: newTask.title.trim(), status: newTask.status, dueDate: newTask.dueDate, priority: newTask.priority }] }))
    setNewTask({ title: "", status: "À faire", dueDate: "", priority: "Moyenne" })
    setIsTaskModalOpen(false)
  }

  const handleResourceSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!newResource.title.trim() || !newResource.url.trim()) return
    updateSelectedProject((project) => ({ ...project, resources: editingResourceId ? project.resources.map((resource) => resource.id === editingResourceId ? { ...resource, title: newResource.title.trim(), url: newResource.url.trim() } : resource) : [...project.resources, { id: createId(), title: newResource.title.trim(), url: newResource.url.trim() }] }))
    setNewResource({ title: "", url: "" })
    setEditingResourceId(null)
    setIsResourceModalOpen(false)
  }

  const deleteResource = (resourceId: string) => {
    updateSelectedProject((project) => ({ ...project, resources: (project.resources ?? []).filter((resource) => resource.id !== resourceId) }))
  }

  const handleEditResource = (resource: ProjectResource) => {
    setNewResource({ title: resource.title, url: resource.url })
    setEditingResourceId(resource.id)
    setOpenResourceMenuId(null)
    setIsResourceModalOpen(true)
  }

  const validateProject = () => {
    if (!selectedProject) return
    const nextProject = activeProjects.find((project) => project.id !== selectedProject.id) ?? null
    setProjects((currentProjects) => currentProjects.map((project) => project.id === selectedProject.id ? { ...project, status: "Terminé", archived: true } : project))
    setSelectedProjectId(nextProject?.id ?? null)
  }
  const deleteProject = () => {
    if (!selectedProject) return
    const nextActiveProjects = activeProjects.filter((project) => project.id !== selectedProject.id)
    setProjects((currentProjects) => currentProjects.filter((project) => project.id !== selectedProject.id))
    setSelectedProjectId(nextActiveProjects[0]?.id ?? null)
  }

  const restoreProject = (projectId: string) => {
    setProjects((currentProjects) => currentProjects.map((project) => project.id === projectId ? { ...project, archived: false, status: "En cours" } : project))
    setSelectedProjectId(projectId)
  }

  const handleAttachment = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !selectedProject) return
    if (file.size > 1_500_000) {
      setAttachmentError("Le document est trop volumineux (1,5 Mo maximum).")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== "string") return
      updateSelectedProject((project) => ({ ...project, attachments: [...(project.attachments ?? []), { id: createId(), name: file.name, url: reader.result }] }))
      setAttachmentError("")
      event.target.value = ""
    }
    reader.readAsDataURL(file)
  }

  const handleReplaceAttachment = (attachmentId: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !selectedProject) return
    if (file.size > 1_500_000) {
      setAttachmentError("Le document est trop volumineux (1,5 Mo maximum).")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const fileUrl = reader.result
      if (typeof fileUrl !== "string") return
      updateSelectedProject((project) => ({ ...project, attachments: (project.attachments ?? []).map((attachment) => attachment.id === attachmentId ? { ...attachment, name: file.name, url: fileUrl } : attachment) }))
      setAttachmentError("")
      setOpenAttachmentMenuId(null)
      event.target.value = ""
    }
    reader.readAsDataURL(file)
  }

  const deleteAttachment = (attachmentId: string) => {
    updateSelectedProject((project) => ({ ...project, attachments: (project.attachments ?? []).filter((attachment) => attachment.id !== attachmentId) }))
    setOpenAttachmentMenuId(null)
  }

  return (
    <div className="project-page">
      <PageHeading className="project-header" eyebrow="Projects" title="Mes projets" />

      <div className="project-top-grid"><section className="project-section project-overview" aria-labelledby="overview-heading"><h2 id="overview-heading">Vue d’ensemble</h2><div className="project-overview__stats"><article><span>Projets en cours</span><strong>{stats.inProgress}</strong></article><article><span>À commencer</span><strong>{stats.pending}</strong></article><article><span>Terminés</span><strong>{stats.completed}</strong></article><article><span>Total projets</span><strong>{projects.length}</strong></article></div></section></div>

      <div className="project-workspace">
        <section className="project-projects" aria-labelledby="projects-heading"><div className="project-projects__list"><h2 id="projects-heading">Mes projets</h2>{activeProjects.map((project) => <article key={project.id} className={`project-list-card${project.id === selectedProject?.id ? " is-selected" : ""}`} onClick={() => setSelectedProjectId(project.id)}><img src={project.image} alt="" /><div className="project-list-card__content"><h3>{project.title}</h3><span className={`project-status ${statusClassName(project.status)}`}>{project.status}</span><div className="project-progress"><span style={{ width: `${projectProgress(project)}%` }} /></div></div><strong>{projectProgress(project)}%</strong></article>)}<button type="button" className="project-add-button" onClick={() => setIsProjectModalOpen(true)}>+ Nouveau projet</button></div></section>

        <section className="project-section project-active" aria-labelledby="active-project-heading">
          <h2 id="active-project-heading">Projet en cours</h2>
          {selectedProject ? <><article className="project-active__card"><header className="project-active__header"><img src={selectedProject.image} alt="" /><div className="project-active__intro"><h3>{selectedProject.title}</h3><p>{selectedProject.description || "Aucune description renseignée."}</p></div><span className={`project-status ${statusClassName(selectedProject.status)}`}>{selectedProject.status}</span></header><dl className="project-active__meta"><div><dt><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4m8-4v4" /></svg>Date de début</dt><dd>{formatDate(selectedProject.startDate)}</dd></div><div><dt><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><path d="m14.5 9.5 5-5M16 4.5h3.5V8" /></svg>Date objectif</dt><dd>{formatDate(selectedProject.targetDate)}</dd></div><div><dt><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.78 5.64 6.22.9-4.5 4.39 1.06 6.2L12 17.2l-5.56 2.93 1.06-6.2L3 9.54l6.22-.9L12 3Z" /></svg>Priorité</dt><dd><span className={`project-priority ${priorityClassName(selectedProject.priority)}`}>{selectedProject.priority}</span></dd></div><div><dt><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></svg>Statut</dt><dd><span className={`project-status ${statusClassName(selectedProject.status)}`}>{selectedProject.status}</span></dd></div></dl><div className="project-active__progress"><div><span>Avancement global</span><strong>{projectProgress(selectedProject)}%</strong></div><div className="project-progress"><i style={{ width: `${projectProgress(selectedProject)}%` }} /></div></div></article><section className="project-section" aria-labelledby="timeline-heading"><h2 id="timeline-heading">Timeline</h2><ol className="project-timeline">{selectedProject.tasks.length ? selectedProject.tasks.map((task) => <li className={task.status === "Terminée" ? "is-complete" : task.status === "En cours" ? "is-active" : ""} key={task.id}><time>{formatDate(task.dueDate)}</time><span>{task.title}</span></li>) : <li><span>Aucune tâche à afficher.</span></li>}</ol></section>
          <div className="project-tasks"><div className="project-tasks__table" role="table"><div className="project-tasks__row project-tasks__row--head" role="row"><span>Tâches principales</span><span>Statut</span><span>Échéance</span><span>Priorité</span></div>{selectedProject.tasks.map((task) => <div className={`project-tasks__row${task.status === "Terminée" ? " is-complete" : ""}`} role="row" key={task.id}><div className="project-task__title"><button type="button" className="project-task__check" aria-label={`${task.status === "Terminée" ? "Marquer comme à faire" : "Marquer comme terminée"} : ${task.title}`} aria-pressed={task.status === "Terminée"} onClick={() => updateSelectedProject((project) => ({ ...project, tasks: project.tasks.map((item) => item.id === task.id ? { ...item, status: item.status === "Terminée" ? "À faire" : "Terminée" } : item) }))}>{task.status === "Terminée" ? "✓" : null}</button><span>{task.title}</span></div><span className={task.status === "Terminée" ? "is-complete" : task.status === "En cours" ? "is-current" : ""}>{task.status === "Terminée" ? "✓ " : task.status === "En cours" ? "○ " : "○ "}{task.status}</span><span>{formatDate(task.dueDate)}</span><span><b className={`project-priority ${priorityClassName(task.priority)}`}>{task.priority}</b></span></div>)}<button type="button" className="project-add-task" onClick={() => setIsTaskModalOpen(true)}>+ Ajouter une tâche</button></div></div><div className="project-active__support"><section className="project-section" aria-labelledby="notes-heading"><h2 id="notes-heading">Notes &amp; idées</h2><textarea className="project-notes__input" value={selectedProject.notes ?? ""} onChange={(event) => updateSelectedProject((project) => ({ ...project, notes: event.target.value }))} placeholder="Écris tes notes et idées ici…" aria-label="Notes et idées" /></section><section className="project-section" aria-labelledby="resources-heading"><h2 id="resources-heading">Ressources &amp; liens</h2><ul className="project-links project-links--trello">{(selectedProject.resources ?? []).map((resource) => <li key={resource.id}><img src={faviconUrl(resource.url)} alt="" /><a href={resource.url} target="_blank" rel="noreferrer">{resource.title}</a><div className="account-menu"><button type="button" className="profile-menu" aria-label={`Options pour ${resource.title}`} aria-expanded={openResourceMenuId === resource.id} onClick={() => setOpenResourceMenuId((current) => current === resource.id ? null : resource.id)}><span aria-hidden="true">...</span></button>{openResourceMenuId === resource.id ? <div className="account-menu__panel" role="menu"><button type="button" className="account-menu__item" onClick={() => handleEditResource(resource)}>Modifier</button><button type="button" className="account-menu__item account-menu__item--danger" onClick={() => { deleteResource(resource.id); setOpenResourceMenuId(null) }}>Supprimer</button></div> : null}</div></li>)}</ul><button type="button" className="project-add-task" onClick={() => { setEditingResourceId(null); setNewResource({ title: "", url: "" }); setIsResourceModalOpen(true) }}>+ Ajouter un lien</button></section><section className="project-section" aria-labelledby="attachments-heading"><h2 id="attachments-heading">Pièces jointes</h2><ul className="project-links project-attachments">{(selectedProject.attachments ?? []).map((attachment) => <li key={attachment.id}><button type="button" onClick={() => setPreviewAttachment(attachment)}>{attachment.name}</button><div className="account-menu"><button type="button" className="profile-menu" aria-label={`Options pour ${attachment.name}`} aria-expanded={openAttachmentMenuId === attachment.id} onClick={() => setOpenAttachmentMenuId((current) => current === attachment.id ? null : attachment.id)}><span aria-hidden="true">...</span></button>{openAttachmentMenuId === attachment.id ? <div className="account-menu__panel" role="menu"><label className="account-menu__item"><input type="file" onChange={(event) => handleReplaceAttachment(attachment.id, event)} />Modifier</label><button type="button" className="account-menu__item account-menu__item--danger" onClick={() => deleteAttachment(attachment.id)}>Supprimer</button></div> : null}</div></li>)}</ul><label className="project-attachment__add">+ Ajouter un document<input type="file" onChange={handleAttachment} /></label>{attachmentError ? <p className="project-attachment__error">{attachmentError}</p> : null}</section></div><div className="project-active__actions"><button type="button" onClick={validateProject} disabled={selectedProject.status === "Terminé"}>Valider le projet</button><button type="button" onClick={deleteProject}>Supprimer</button></div></> : <p className="project-empty-state">Ajoute un projet pour commencer.</p>}
        </section>
      </div>

      <Link to="/project/archives" className="project-archive-link">Archivés <span>{archivedProjects.length}</span></Link>

      {isProjectModalOpen ? <div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title"><div className="project-modal__backdrop" onClick={() => setIsProjectModalOpen(false)} /><form className="project-modal__panel" onSubmit={handleProjectSubmit}><div className="project-modal__header"><h2 id="project-modal-title">Nouveau projet</h2><button type="button" aria-label="Fermer" onClick={() => setIsProjectModalOpen(false)}>×</button></div><label>Titre<input value={newProject.title} onChange={(event) => setNewProject({ ...newProject, title: event.target.value })} required autoFocus /></label><label>Description<textarea value={newProject.description} onChange={(event) => setNewProject({ ...newProject, description: event.target.value })} /></label><div className="project-modal__fields"><label>Date de début<input type="date" value={newProject.startDate} onChange={(event) => setNewProject({ ...newProject, startDate: event.target.value })} /></label><label>Date objectif<input type="date" value={newProject.targetDate} onChange={(event) => setNewProject({ ...newProject, targetDate: event.target.value })} /></label></div><div className="project-modal__fields"><label>Statut<select value={newProject.status} onChange={(event) => setNewProject({ ...newProject, status: event.target.value as ProjectStatus })}><option>À commencer</option><option>En cours</option><option>Terminé</option></select></label><label>Priorité<select value={newProject.priority} onChange={(event) => setNewProject({ ...newProject, priority: event.target.value as Priority })}><option>Basse</option><option>Moyenne</option><option>Haute</option></select></label></div><label>Image<input type="file" accept="image/*" onChange={handleProjectImage} /></label><div className="project-modal__actions"><button type="button" onClick={() => setIsProjectModalOpen(false)}>Annuler</button><button type="submit">Ajouter</button></div></form></div> : null}
      {isTaskModalOpen ? <div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title"><div className="project-modal__backdrop" onClick={() => setIsTaskModalOpen(false)} /><form className="project-modal__panel" onSubmit={handleTaskSubmit}><div className="project-modal__header"><h2 id="task-modal-title">Ajouter une tâche</h2><button type="button" aria-label="Fermer" onClick={() => setIsTaskModalOpen(false)}>×</button></div><label>Tâche<input value={newTask.title} onChange={(event) => setNewTask({ ...newTask, title: event.target.value })} required autoFocus /></label><div className="project-modal__fields"><label>Échéance<input type="date" value={newTask.dueDate} onChange={(event) => setNewTask({ ...newTask, dueDate: event.target.value })} /></label><label>Priorité<select value={newTask.priority} onChange={(event) => setNewTask({ ...newTask, priority: event.target.value as Priority })}><option>Basse</option><option>Moyenne</option><option>Haute</option></select></label></div><label>Statut<select value={newTask.status} onChange={(event) => setNewTask({ ...newTask, status: event.target.value as TaskStatus })}><option>À faire</option><option>En cours</option><option>Terminée</option></select></label><div className="project-modal__actions"><button type="button" onClick={() => setIsTaskModalOpen(false)}>Annuler</button><button type="submit">Ajouter</button></div></form></div> : null}
      {isResourceModalOpen ? <div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="resource-modal-title"><div className="project-modal__backdrop" onClick={() => setIsResourceModalOpen(false)} /><form className="project-modal__panel" onSubmit={handleResourceSubmit}><div className="project-modal__header"><h2 id="resource-modal-title">Ajouter une ressource ou un lien</h2><button type="button" aria-label="Fermer" onClick={() => setIsResourceModalOpen(false)}>×</button></div><label>Nom<input value={newResource.title} onChange={(event) => setNewResource({ ...newResource, title: event.target.value })} required autoFocus /></label><label>Lien<input type="url" value={newResource.url} onChange={(event) => setNewResource({ ...newResource, url: event.target.value })} required /></label><div className="project-modal__actions"><button type="button" onClick={() => setIsResourceModalOpen(false)}>Annuler</button><button type="submit">Ajouter</button></div></form></div> : null}
      {previewAttachment ? <div className="project-modal project-preview-modal" role="dialog" aria-modal="true" aria-labelledby="attachment-preview-title"><div className="project-modal__backdrop" onClick={() => setPreviewAttachment(null)} /><div className="project-modal__panel project-preview-modal__panel"><div className="project-modal__header"><h2 id="attachment-preview-title">{previewAttachment.name}</h2><button type="button" aria-label="Fermer" onClick={() => setPreviewAttachment(null)}>×</button></div>{previewAttachment.url.startsWith("data:image/") ? <img className="project-preview-modal__image" src={previewAttachment.url} alt={previewAttachment.name} /> : <iframe className="project-preview-modal__document" src={previewAttachment.url} title={previewAttachment.name} />}</div></div> : null}
    </div>
  )
}

export default ProjectPage
