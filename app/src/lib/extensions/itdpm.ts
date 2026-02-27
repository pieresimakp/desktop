export const buildTaskLink = (endpoint: string, taskId: number) => {
  const origin = new URL(endpoint).origin
  return `${origin}/web#id=${taskId}&cids=1&menu_id=109&action=185&model=project.task&view_type=form`
}

export const prependTaskIdToSummary = (summary: string, taskId: string) => {
  const prefix = `[${taskId}]`
  const trimmed = summary.replace(/^\[TASK[^\]]*\]\s*/i, '')
  return trimmed.length > 0 ? `${prefix} ${trimmed}` : prefix
}
