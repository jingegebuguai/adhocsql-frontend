export const urlMap = {

    baseUrl: 'http://10.110.30.133',

    execute: {
        execute: '/adhoc-sql/execute/execute',

    },
    record: {
        historyResult: '/adhoc-sql/execute/history/result',
        historyLog: '/adhoc-sql/execute/history/log',
        historyList: '/adhoc-sql/execute/history/list',
        exportSql: '/adhoc-sql/execute/history/export'
    },

    temporary: {
        tempForm: '/adhoc-sql/temporary_table/save',
        tempList: '/adhoc-sql/resource/temporary_table/list',
        deleteTemp: '/adhoc-sql/temporary_table/delete',
        checkTemp: '/adhoc-sql/temporary_table/check'
    },

    resource: {
        resourceList: '/adhoc-sql/resource/list',
        resourceSchema: '/adhoc-sql/resource/schema'
    },

    collect: {
        collectList: '/adhoc-sql/favorite/list',
        modify: '/adhoc-sql/favorite/modify',
        collectSql: '/adhoc-sql/favorite/save',
        delete: '/adhoc-sql/favorite/delete'
    }
}