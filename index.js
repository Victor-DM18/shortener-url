const express = require("express")
const knex = require("knex")
const base64 = require("base-64")
const utf8 = require("utf8")
const knexfile = require("./knexfile")
const app = express()
const db = knex(knexfile)
const encode = (num) => base64.encode(utf8.encode(String(num)))
const decode = (str) => Number(utf8.decode(base64.decode(str)))

app
  .use(express.json())
  .get("/s/:id", async (req, res) => {
    const {
      params: { id: short },
    } = req

    if (!short) {
      return res.status(404).send({ error: "Not found" })
    }

    const id = decode(short)
    const [existing] = await db("urls").select("url").where({ id })

    if (!existing) {
      return res.status(404).send({ error: "Not found" })
    }

    res.redirect(existing.url)
  })
  .post("/s", async (req, res) => {
    const {
      body: { url },
    } = req
    const [existing] = await db("urls").select("id").where({ url })

    if (existing) {
      return res.send(`http://localhost:4000/s/${encode(existing.id)}`)
    }

    const [id] = await db("urls").insert({ url })
    res.send(`http://localhost:4000/s/${encode(id)}`)
  })

app.listen(4000)
