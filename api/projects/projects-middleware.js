// add middlewares here related to projects

const PROJECTS = require('./projects-model')

async function validateProjectID(req, res, next){
    try{
        const {id} = req.params
        const project = await PROJECTS.get(id)

        if (project){
            req.params = project
            next()
        } else {
            next({ status: 404, message: 'Unable to find project!' })
        }
    } catch (error) {
        next(error)
    }
}

async function validateProject(req, res, next){ 
    const { name, description, completed } = req.body
    if (!name || name.trim()){
        next({ status: 400, message: 'All fields are required! Please try again.' })
    } else {
        req.name = name.trim()
        req.description = description.trim()
        req.completed = completed
        next()
    }
}

module.exports = { validateProject, validateProjectID }