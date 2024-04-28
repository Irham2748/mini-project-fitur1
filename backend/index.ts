import express, { Application, Request, Response } from "express"
import EventRouter from "./routers/event.router"
import bodyParser from "body-parser"

const app: Application = express()

const PORT = 5670

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use("/api/event", EventRouter)

app.get("/", (req: Request, res: Response) => {
    res.status(200).send({
        message: "Success", 
        data: []
    })
})

app.listen(PORT, () => {
    console.log("Server running on port: " + PORT)
})