export interface IItdpmTaskRecord {
  readonly id: number
  readonly sequence_name: string
  readonly name: string
  readonly stage_id: [number, string] | false
}

export interface IItdpmResponse {
  readonly result?: {
    readonly records?: ReadonlyArray<IItdpmTaskRecord>
  }
  readonly error?: {
    readonly message?: string
    readonly data?: {
      readonly message?: string
    }
  }
}

export const itdpmRequestBody = {
  id: 16,
  jsonrpc: '2.0',
  method: 'call',
  params: {
    model: 'project.task',
    domain: [
      '&',
      ['personal_stage_type_ids', '=', 1918],
      ['user_ids', 'in', 63],
    ],
    fields: [
      'sequence_name',
      'message_needaction',
      'is_closed',
      'allow_subtasks',
      'sequence',
      'priority',
      'name',
      'child_text',
      'project_id',
      'project_category_id',
      'partner_id',
      'parent_id',
      'user_ids',
      'custom_checklist',
      'check_bool_enable_task_check_list',
      'checklist',
      'company_id',
      'activity_ids',
      'activity_exception_decoration',
      'activity_exception_icon',
      'activity_state',
      'activity_summary',
      'activity_type_id',
      'activity_type_icon',
      'start_date',
      'date_deadline',
      'tag_ids',
      'kanban_state',
      'stage_id',
      'check_bool_project_priority',
      'sh_priority',
      'recurrence_id',
    ],
    limit: 80,
    sort: '',
    context: {
      lang: 'en_US',
      tz: 'Asia/Jakarta',
      uid: 63,
      allowed_company_ids: [1],
      params: {
        cids: 1,
        menu_id: 109,
        action: 185,
        model: 'project.task',
        view_type: 'list',
      },
      search_default_my_tasks: 1,
      search_default_personal_stage: 1,
      all_task: 0,
      bin_size: true,
    },
  },
}
