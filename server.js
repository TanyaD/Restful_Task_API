var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', __dirname+ '/views');
app.set('view engine', 'ejs');
var session = require('express-session');
app.use(session({secret:'codingdojo'}));

app.get('/', function(req, res) {
    res.json({ message: 'welcome to our api!' });   
});
app.get('/tasks',function(request,response){
    Task.find({}).exec(function(err,tasks){
    response.json({tasks})
    })
})
app.post('/tasks', function(req, res){
    console.log("POST DATA", req.body);
    var task=new Task({title:req.body.title, description:req.body.description});
    task.save(function(error){
        if(error){
            res.send(error)
        }
        else{
            console.log("success");
            res.json(task)
        }
    })
})

app.get('/tasks/:id', function(req,res){

    Task.find({_id:req.params.id},function(err,task){
        
    console.log(task)
    res.json({task:task[0]})
    })
})
app.delete('/tasks/:id', function(req,res){
    
        Task.remove({_id:req.params.id},function(err,task){
            
        console.log(task)
        res.json(task)
        })
})

app.put('/tasks/:id', function(req,res){
    
        Task.update({_id:req.params.id},req.body,function(err,task){
            
        console.log(task)
        res.json(task)
        })
})

mongoose.connect('mongodb://localhost/restful_db');
var TaskSchema = new mongoose.Schema({
    title: {type: String, required:true, minlength:2},
    description: {type: String, default:' '},
    completed: {type: Boolean, default: 'false'},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
})



mongoose.model('Tasks', TaskSchema);
var Task = mongoose.model('Tasks')
mongoose.Promise = global.Promise;

app.listen(8000, function(){
    console.log("listening on port 8000");
})