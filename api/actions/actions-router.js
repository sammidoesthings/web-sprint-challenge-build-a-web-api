// Write your "actions" router here!
const express = require('express')

const ACTIONS = require('./actions-model')
const router = express.Router()

const { validateActionID, validateActions } = require('./actions-middleware')
//TYPO IN FILENAME OF ACTIONS-MIDDLEWARE/ACTIONS-MIDDLWARE.JS

router.get('/', (req, res) =>{
    ACTIONS.get()
        .then(actions =>{
            res.status(200).json(actions)
        })
        .catch(()=>{
            res.status(400).json({message: 'Error retrieving actions!'})
        })
})

router.get('/:id', validateActionID, async (req, res, next)=>{
    try{
        res.status(200).json(req.action)
    }catch(error){
        next({status: 404, message: 'Error occurred! Please try again.'})
    }
})

router.post('/', (req, res)=>{
    const newAction = req.body
    if(!newAction.project_id || !newAction.description || !newAction.notes){
        res.status(400).json({
            message: "All information is required! Please try again."
        })
    } else {
        ACTIONS.insert(newAction)
        .then(()=>{
            res.status(201).json(newAction)
        })
        .catch(error =>{
            console.log(error)
            res.status(500).json({message: 'Error occurred! Please try again.'})
        })
    }
})

router.put('/:id', validateActionID, validateActions, async (req, res)=>{
    const updatedAction = await ACTIONS.update(req.params.id, {
        project_id: req.project_id,
        description: req.description,
        notes: req.notes,
        completed: req.completed
    })
    res.status(200).json(updatedAction)
})

router.delete('/:id', validateActionID, async (req, res, next)=>{
    try{
        await ACTIONS.remove(req.params.id)
        res.json(res.ACTIONS)
    } catch (error){
        next({status: 404, message: 'Error occurred! Please try again.'})
    }
})

module.exports = router
