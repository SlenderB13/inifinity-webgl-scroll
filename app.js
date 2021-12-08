require('dotenv').config()

const app = require('./config')

const Prismic = require('@prismicio/client')

const initApi = req => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req: req
  })
}

app.listen(app.get('port'), () => {
})

app.get('/', async (request, response) => {
  const api = await initApi(request)
  const medias = await api.query(Prismic.Predicates.at('document.type', 'gallery'), {
    orderings: '[images]'
  })

  const gallery = medias.results[0].data
  const images = []

  for (let i = 0; i <= 4; i++) {
    const image = gallery.gallery[i].image.url
    images.push(image)
  }

  response.render('pages/home', {
    images
  })
})

app.get('/about', (request, response) => {
  response.render('pages/about')
})

app.use((request, response) => {
  response.status(404)

  if (request.accepts('html')) {
    return response.redirect('/')
  }

  if (request.accepts('json')) {
    return response.send({ error: 'Not Found' })
  }

  response.type('txt').send('Not Found')
})
