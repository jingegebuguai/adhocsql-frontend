export const table = {
    recordTable: [
        {
            prop: 'create_time',
            label: '任务执行时间',
            align: 'center',
        },
        {
            prop: 'id',
            label: '任务Id',
            align: 'center',
            sortable: true
        },
        {
            prop: 'sql_content',
            label: 'SQL',
            align: 'center',
        },
        {
            prop: 'status',
            label: '状态',
            align: 'center',
        }
    ],
    collectTable: [
        {
            prop: 'query_name',
            label: '查询名称',
            align: 'center',
        },
        {
            prop: 'id',
            label: '查询Id',
            align: 'center',
            sortable: true
        },
        {
            prop: 'sql_content',
            label: 'SQL',
            align: 'center',
        },
        {
            prop: 'create_time',
            label: '更新时间',
            align: 'center',
        }
    ]
}