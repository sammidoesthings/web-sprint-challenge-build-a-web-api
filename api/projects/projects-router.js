// Write your "projects" router here!
const express = require('express')

const PROJECTS = require('./projects-model')

const router = express.Router()

const { validateProjectID, validateProject } = require('./projects-middleware')

router.get('/', (req, res) => {
    PROJECTS.get()
        .then(project => {
            res.status(200).json(project)
        })
        .catch(() => {
            res.status(400).json({ message: 'Error retrieving projects' })
        })
})

router.get('/:id', validateProjectID, (req, res, next) =>{
    try {
        res.status(200).json(req.params)
    } catch(error){
        next(error)
    }
})

router.post('/', (req, res)=>{
    const newProject = req.body 
    PROJECTS.insert(newProject)
        .then(()=>{
            res.status(201).json(newProject)
        })
        .catch(error =>{
            res.status(400).json({
                message: 'Error posting your new project! Please try again.',
                error: error.message,
                stack: error.stack
            })
        })
})

router.put('/:id', validateProjectID, validateProject, (req, res, next)=>{
    if (req.body.completed === undefined) {
        next({ status: 400, message: `Error fetching project that project. Please try again.`})
    } else {
        PROJECTS.update(req.params.id, req.body)
            .then(()=>{
                return PROJECTS.get(req.params.id)
            })
            .then(project =>{
                res.json(project)
            })
            .catch(next)
    }
})

router.delete('/:id', validateProjectID, async (req, res, next)=>{
    try {
        await PROJECTS.remove(req.params.id)
        res.json(res.Project)
    } catch (error){
        next(error)
    }
})

router.get('/:id/actions', validateProjectID, async (req, res, next) =>{
    PROJECTS.getProjectActions(req.params.id)
        .then(actions => {
            if (actions.length > 0){
                res.status(200).json(actions)
            } else {
                res.status(404).json((actions))
            }
        })
        .catch(next)
})


module.exports = router