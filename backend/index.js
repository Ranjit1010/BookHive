const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const multer = require('multer');
const http = require('http');
const { Server } = require('socket.io');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
const upload = multer({ storage: storage })

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer,{
    cors:{
        origin:'*'
    }
})


app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const port = 5000;
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://ranjitkr188:sOEbzV89SMxk1Hoz@cluster0.hd7fkm3.mongodb.net/book-store');

const Users = mongoose.model('Users', 
{ 
    username: String ,
    mobile:String ,
    email: String ,
    password:String ,
    likedProducts : [{type:mongoose.Schema.Types.ObjectId,ref:'Products'}] 
});

let schema = new mongoose.Schema({
    pname:String,
    pdesc:String,
    price:Number,
    category:String,
    pimage:String,
    addedBy:mongoose.Schema.Types.ObjectId,
    pLoc:{
       type:{
        type:String,
        enum:['Point'],
        default:'Point'
       },
       coordinates:{
        type:[Number]
       }
    }

})

schema.index({pLoc:'2dsphere'});

const Products = mongoose.model('Products',schema);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/search', (req, res) => {
    console.log(req.query);

    // Correctly split the loc parameter to get latitude and longitude
    let [latitude, longitude] = req.query.loc.split(',');

    let search = req.query.search;

    Products.find({
        $or: [
            { pname: { $regex: search, $options: 'i' } },
            { pdesc: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } },
        ],
        pLoc: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(latitude), parseFloat(longitude)]
                },
                $maxDistance:10000, // Adjust the distance as per your requirement (in meters)
            }
        }
    })
    .then((result) => {
        res.send({ message: 'success', product: result });
    })
    .catch((err) => {
        console.error("Error during search:", err);
        res.status(500).send({ message: 'server error' });
    });
});



// Create an API to like the product
app.post('/like-products',(req,res)=>{
    let productId = req.body.productId;
    let userId = req.body.userId;

    console.log(req.body);

    Users.updateOne({_id:userId},{$addToSet : {likedProducts: productId}})
    .then(() => {
        res.send({message:'liked success'})
    })
    .catch(()=>{
        res.send({message:'server error'})
    })
})

// Create an API to dislike the product
app.post('/dislike-products',(req,res)=>{
    let productId = req.body.productId;
    let userId = req.body.userId;

    console.log(req.body);

    Users.updateOne({_id:userId},{$pull : {likedProducts: productId}})
    .then(() => {
        res.send({message:'disliked success'})
    })
    .catch(()=>{
        res.send({message:'server error'})
    })
})

// Create an API for Add Product
app.post('/addproduct', upload.single('pimage'), (req,res)=>{

    console.log(req.file);
    console.log(req.body);
    
    const plat= req.body.plat;
    const plong= req.body.plong;
    const pname= req.body.pname;
    const pdesc= req.body.pdesc;
    const price= req.body.price;
    const category= req.body.category;
    const pimage =req.file.path;
    const addedBy =req.body.userId;

    const product = new Products({pname, pdesc, price, category, pimage, addedBy , 
        pLoc: {type:'Point' , coordinates:[plat,plong]} });
    product.save()
    .then(() => {
        res.send({message:'saves success'})
    })
    .catch(()=>{
        res.send({message:'server error'})
    })
})

// Create an API for Add Product
app.post('/edit-product', upload.single('pimage'), (req,res)=>{

    console.log(req.file);
    console.log(req.body);
    
    const pid = req.body.pid;
    const pname= req.body.pname;
    const pdesc= req.body.pdesc;
    const price= req.body.price;
    let pimage = req.body.pimage;
    const category= req.body.category;
    
    if (req.file) {
        pimage = req.file.path;
    }
    
    // const addedBy =req.body.userId;

    let editObj ={};
    if(pname){
        editObj.pname = pname;
    }
    if(pdesc){
        editObj.pdesc = pdesc;
    }
    if(price){
        editObj.price = price;
    }
    if(category){
        editObj.category = category;
    }
    if(pimage){
        editObj.pimage = pimage;
    }

    Products.updateOne({_id:pid},editObj,{new:true})
    .then(() => {
        res.send({message:'updated successfully'})
    })
    .catch(()=>{
        res.send({message:'server error'})
    })
})

//Create an API To Get the Products
app.get('/get-products',(req,res)=>{

    const catName = req.query.catName;
    console.log(catName)
    let _f = {}
    if(catName){
        _f={category:catName}
    }

    Products.find(_f)
    .then((result)=>{
        res.send({message:'success', product:result})
    })
    .catch((err)=>[
        res.send({message:'server error'})
    ])
})

//Create an API To Delete the Products
app.post('/delete-product',(req,res)=>{
    console.log(req.body);

    Products.findOne({_id: req.body.pid})
    .then((result)=>{
        if(result.addedBy == req.body.userId){
            Products.deleteOne({_id:req.body.pid})
            .then((deleteResult)=>{
                if(deleteResult.acknowledged){
                    res.send({message:'success'})
                }
            })
            .catch((err)=>[
                res.send({message:'server error'})
            ])
        }
    })
    .catch((err)=>[
        res.send({message:'server error'})
    ])
 })

//Create An API for getting clicked product details
app.get('/get-product/:pid',(req,res)=>{

    Products.findOne({_id:req.params.pid})
    .then((result)=>{
        res.send({message:'success', product:result})
    })
    .catch((err)=>[
        res.send({message:'server error'})
    ])
})

//create an API for getting Liked Product
app.post('/liked-products',(req,res)=>{
    Users.findOne({_id:req.body.userId}).populate('likedProducts')
    .then((result)=>{
        res.send({message:'success', product:result.likedProducts })
    })
    .catch((err)=>[
        res.send({message:'server error'})
    ])
})

//create an API for getting My Product
app.post('/my-products',(req,res)=>{

    const userId = req.body.userId;

    Products.find({addedBy:userId})
    .then((result)=>{
        res.send({message:'success', product: result})
    })
    .catch((err)=>[
        res.send({message:'server error'})
    ])
})

// Create an API for SIGNUP Page
app.post('/signup', (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const mobile =req.body.mobile;
    const user = new Users({ username:username, password:password, email, mobile});

    user.save().then(() => {
        res.send({message:'saves success'})
    })
    .catch(()=>{
        res.send({message:'server error'})
    })
})

//Create an API for getting into MyProfile
app.get('/my-profile/:userId',(req,res)=>{
    let uid = req.params.userId;

    Users.findOne({_id:uid})
    .then((result) => {
        res.send({message:'success', user:{
            email:result.email,
            mobile:result.mobile, username:result.username}})
    })
    .catch(()=>{
        res.send({message:'server error'})
    })
})


//Create an API to User Id
app.get('/get-user/:uId',(req,res)=>{
    const _userId = req.params.uId
    Users.findOne({_id:_userId})
    .then((result) => {
        res.send({message:'success', user:{email:result.email, mobile:result.mobile, username:result.username}})
    })
    .catch(()=>{
        res.send({message:'server error'})
    })
})

// Create an API for Login page
app.post('/login', (req,res)=>{
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    
    Users.findOne({username:username})
        .then((result) => {
            if(!result){
                res.send({message:'user not found'})
            }
            else{
                if(result.password == password){
                    const token = jwt.sign({
                        data: 'foobar'
                    }, 'sec_book', { expiresIn: '1h' });
                    res.send({message:'Find user success' , token:token, userId:result._id , username:result.username })
                }
                if(result.password != password){
                    res.send({message:'password is not valid'})
                    }
            }
            
    })
    .catch(()=>{
        res.send({message:'server error'})
    })
})

let messages = [];

io.on('connection', (socket) => {
    console.log('A user connected',socket.id);
  
    socket.on('sendMsg', (data) => {
      messages.push(data);
      io.emit('getMsg', messages)
    })
    io.emit('getMsg',messages)
  })

httpServer.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
