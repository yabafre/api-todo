module.exports = {
    apps: [{
        script: 'app.js',
        name: 'todo-api',
        exec_mode: 'cluster',
        instances: 1,
        out_file: 'NULL', // Redirects stdout (regular logs) to the default output
        error_file: 'NULL', // Redirects stderr (error logs) to the default output
        log_date_format: 'YYYY-MM-DD HH:mm Z', // Formats the timestamp
        combine_logs: true, // Combines stdout and stderr into the same stream
    }]
}