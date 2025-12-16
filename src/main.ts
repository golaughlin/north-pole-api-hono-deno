import { Hono } from "hono"
import { db } from "./db.ts"
import { childrenTable } from "./db/schema.ts"
import { Child } from "./types.ts"
import { eq } from "drizzle-orm"

// Create Hono App
const app = new Hono()

// Welcome message
app.get('/', (c) => {
  return c.text("Ho! Ho! Ho! Welcome to Santa's Naughty and Nice List API!")
})

// Get list of children
app.get('/children', async (c) => {
  const childrenList = await db
    .select()
    .from(childrenTable)
  console.log(`[${Date()}] Naughty and Nice List accessed.`)
  return c.json(childrenList, 200)
})

// Get individual child
app.get('/children/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const [child] = await db
    .select()
    .from(childrenTable)
    .where(eq(childrenTable.id, id))
  if (!child) {
    console.error(`[${Date()}] There was an attempt to fetch a child on the list that doesn't exist.`)
    return c.json({ error: "Child not found on Santa's List"}, 404)
  }
  console.log(`[${Date()}] Info on Child with an ID of ${id} fetched`)
  return c.json(child, 200)
})

// Add a new child to the list
app.post('/children', async (c) => {
  const {firstName, lastName, dateOfBirth, hometown, isNice} = await c.req.json<Child>()

  try {
    await db.insert(childrenTable).values({
      firstName,
      lastName,
      dateOfBirth,
      hometown,
      isNice
    })
    console.log(`[${Date()}] A new child has been added to the list.`)
    return c.json({ message: "Child added to list" }, 201)
  } catch (error) {
    console.error(error)
    return c.json({ error: "Could not add child to list." }, 400)
  }
})

// Update an individual child
app.put('/children/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const updatedChild = await c.req.json<Child>()
  
  try {
    await db
      .update(childrenTable)
      .set({
        firstName: updatedChild.firstName,
        lastName: updatedChild.lastName,
        dateOfBirth: updatedChild.dateOfBirth,
        hometown: updatedChild.hometown,
        isNice: updatedChild.isNice,
      })
      .where(eq(childrenTable.id, id))
    console.log(`[${Date()}] Info on Child #${id} updated.`)
    return c.json({ message: "Child updated" }, 201)
  } catch (error) {
    console.error(error)
    return c.json({ error: `Could not update child #${id}` }, 400)
  }
})

// Remove child from list
app.delete('children/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  
  try {
    await db.delete(childrenTable).where(eq(childrenTable.id, id))
    console.log(`[${Date()}] Child #${id} removed from list.`)
    return c.json({ message: "Child removed"}, 200)
  } catch (error) {
    console.error(error)
    return c.json({ error: `Could not delete child #${id}` }, 400)
  }
})

// Start server
Deno.serve(app.fetch)
