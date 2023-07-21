const express=require('express');
const app=express();
const PORT=2000;
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var Joi=require('joi');
 
const validationMiddleware =(req,res,next)=>{
    const schema =Joi.object().keys({
        name:Joi.string().required(),
        password:Joi.string().required(),
        search:Joi.string().optional(),
        categoty:Joi.string().optional().valid("Car","Truk","Bus","Bike"),
        amount:Joi.number().integer().min(1).max(20),
        age:Joi.number().when('name',{is:'ram',then:Joi.required(),otherwise:Joi.optional()}),
        item:Joi.object().keys({
            id:Joi.number().required(),
            name:Joi.string().optional()
        }).unknown(true),
        items:Joi.array().items(Joi.object().keys({
            id:Joi.number().required(),
            name:Joi.string().optional()
        })),
        conform_password:Joi.string().valid(Joi.ref('password')).required(),
        limit:Joi.number().required(),
        number:Joi.array().min(Joi.ref('limit')).required(),
        email:Joi.string().email({
            minDomainSegments:2,
            tlds:{allow:["com","in"]}
        }),
        fullname:Joi.string(),
        lastname:Joi.string()
    }).xor("fullname","lastname").unknown(false);
    const {error}=schema.validate(req.body ,{abortEarly:false});
    if(error){
        const{details}=error;
        res.status(200).json({error:details});
    }else{
        next();
    }
}

app.post('/validate',validationMiddleware,async (req,res)=>{
    let result={
        id:1,
        name:'Ram'
    }
    res.status(200).json(req.body)
    res.send('<h1>Server Start....</h1>');
});
app.listen(PORT,()=>console.log('PORT 2000 Satrt..'));