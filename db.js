const sqlite3 = require('sqlite3').verbose()
const dbName = 'later.sqlite'
// Create the database and includes to this database
const db = new sqlite3.Database(dbName)

db.serialize(() => {
    // create the new table in database
    const sql = `
        CREATE TABLE IF NOT EXISTS articles
            (id integer primary key, title, content TEXT)
    `
    db.run(sql)
})

class Article {
    static all(cb) {
        // This is mean that we will select all colums from table 'articles'
        db.all('SELECT * FROM articles', cb)
    }
    static find(id, cb) {
        // Method will select only line with correct 'id'
        db.get('SELECT * FROM articles id = ?', id, cb)
    }
    static create(data, cb) {
        const sql = 'INSERT INTO articles(title, content) VALUES (?, ?)'
        db.run(sql, data.title, data.content, cb)
    }
    static delete(id, cb) {
        if(!id) return cb(new Error('Please provide an id'))
        db.run('DELETE FROM articles WHERE id = ?', id, cb)
    }
}

module.exports = db
module.exports.Article = Article