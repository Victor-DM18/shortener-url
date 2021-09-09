exports.up = async (knex) => {
  await knex.schema.createTable("urls", (table) => {
    table.increments("id")
    table.text("url").notNullable()
  })
}

exports.down = async (knex) => {
  await knex.schema.dropTable("urls")
}
