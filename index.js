import express from 'express'

const app = express()
// app.use(cors())

const port = 3000

app.get('/get-files', async function (req, res) {
	try {
		let url = req.query['url']
		if (!url) throw new Error('not found url')
		let data = await fetch(url)
		let html = await data.text()
		let matchStyles = html.matchAll(/<link[^<]+href="([^"]+)"/g)
		let matchScripts = html.matchAll(/<script[^<]+src="([^"]+)"/g)
		let outputObject = {
			styles: [],
			scripts: [],
		}
		for (let m of matchStyles) {
			if (m[1].includes('.css')) {
				outputObject.styles.push(m[1])
			}
		}
		for (let m of matchScripts) {
			if (m[1].includes('.js')) {
				outputObject.scripts.push(m[1])
			}
		}
		res.json(outputObject)
	} catch (e) {
		res.status(400).send(e.message)
	}
})

app.listen(port)
console.log(`Server started on ${port} port`)
