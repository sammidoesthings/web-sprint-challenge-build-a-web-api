// add middlewares here related to actions

const ACTIONS = require('./actions-model')

async function validateActionID(req, res, next){
    try{
        const {id} = req.params
        const actions = await ACTIONS.get(id)
        
        if (actions){
            req.params = actions
            next()
        } else {
            next({status:404, message: 'Unable to find action!'})
        }
    } catch (error) {
        next(error)
    }
}

async function validateActions(req, res, next){
    const {name, description, completed} = req.body
    if (!name || name.trim()){
        next({status:400, message: 'All fields are required! Please try again.'})
    } else {
        req.name = name.trim()
        req.description = description.trim()
        req.completed = completed 
        next()
    }
}

module.exports = { validateActionID, validateActions }