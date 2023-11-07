require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const read = require('node-readability')

const app = express()
// Создание обхекта, в котором хранятся объекты
// const articles = [{title: 'Example1'},
// {title: 'Example2'},
// {title: 'Example3'},
// {title: 'Example4'}]

// Add the module with db from file
const Article = require('./db').Article

// Метод set
app.set('port', process.env.PORT || 3000)
// Требуется, чтобы объект bodyParser поддерживал тела запросов, закодированных в формате .json
app.use(bodyParser.json())
// Требуется, чтобы объект bodyParser поддерживал тела запросов, закодированных в формате формул
app.use(bodyParser.urlencoded( {extended: true}))

app.get('/articles', (req, res, next) =>{
    // Output the Articles. If we have error, output this error
    Article.all((err, articles) => {
        if (err) return next(err)
        res.format({
            html: () => {
                res.render('articles.ejs', {articles: articles})
            },
            json: () => {
                res.send(articles)
            }
        })
        
    })
})

app.post('/articles', (req, res, next) => {
    // Добавление статьи базуданных  
    const url = req.body.url
    read(url, (err, result) => {
        if (err || !result) res.status(500).send("error downloading article")
        Article.create(
    // Созданеи таблицы для статьи (заголовка и контента)
            {title: result.title, content: result.content},
            (err, article) => {
                if (err) return next (err)
                res.send('ok')
            }
        )
    })
})

app.get('/articles/:id', (req, res, next) => {
    const id = req.params.id
    Article.find(id, (err) => {
        if (err) return next(err)
        res.send(articles)
    })
})

app.delete('/articles/:id', (req, res, next) => {
    const id = req.params.id
    Article.delete(id, (err) => {
        if (err) return next(err)
        res.send({message: 'Deleted'})
    })
})
app.listen(app.get('port'), () => {
    console.log(`server is working at http://127.0.0.1:${app.get('port')}`)
})

module.exports = app