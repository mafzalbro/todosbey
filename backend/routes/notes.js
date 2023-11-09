const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('./middleware/fetchuser')
const Note = require('../models/Note')

// Routes 1: Get All Notes using: GET "/api/notes/fetchallnotes". Login Required 

router.get('/fetchallnotes', fetchuser, async (req, res) => {
    const notes = await Note.find({user: req.user.id})
    res.send({notes})
})

// Routes 2: Add A New Notes using: POST "/api/notes/addnote". Login Required 

router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body ('description', 'Description must be atleast 5 characters').isLength({ min: 5 })
],
async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status (400).json ({ errors: errors.array() });
    }
        // const notes = await Note.find({user: req.user.id})
try {
    
    let note  = await Note.findOne({title: req.body.title});
      
    if (note) return res.status(400).json({error: "Sorry, Create new Note as it already exists"});


    const {title, description, tag} = req.body;
    
    note = new Note({
        title, description, tag, user: req.user.id
    })
    
    const savedNote = await note.save()
    return res.send(savedNote)
} catch (error) {
    return res.status(500).send({error:'Internal Server Error'})
}

})


// ROUTE 3: Update an existing Note using: PUT "/api/auth/updatenote". Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {

    const {title, description, tag} = req.body;

    // Create a newNote object
    const newNote = {};
    if (title) {newNote.title = title};
    if (description) {newNote.description = description};
    if (tag) {newNote.tag = tag};

    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);

    if(!note) {return res.status(404).send("Not Found") }
    
    if (note.user.toString() !== req.user.id) {return res.status(401).send("Not Allowed") }

    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})

    return res.json({note})
})

// ROUTE 4: Delete an existing Note using: DELETE "/api/auth/deletenote". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    
    // const {title, description, tag} = req.body;

    // // Create a newNote object
    // const newNote = {};
    // if (title) {newNote.title = title};
    // if (description) {newNote.description = description};
    // if (tag) {newNote.tag = tag};

    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);

    if(!note) {return res.status(404).send("Not Found") }
    
    if (note.user.toString() !== req.user.id) {return res.status(401).send("Not Allowed") }

    note = await Note.findByIdAndDelete(req.params.id)

    return res.json({note, "message":"This note is deleted successfully!"})
})
module.exports = router


// const obj = {
//     title: 'Now Its time to write!',
//     description: `Let's create something best?` 
// }
// res.json(obj)