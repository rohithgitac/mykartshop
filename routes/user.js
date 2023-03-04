const { dir } = require('console');
const { response } = require('express');
var express = require('express');
const session = require('express-session');
const { userInfo } = require('os');
var router = express.Router();
const path = require('path');
const getuserhelper = require('../helpers/usershelper');
const verifyLogin=(req,res,next)=>{
  if(req.session.user)
  {
    next();
  }
  else{
    res.redirect('/login');
  }
}

/* GET home page. */
router.get('/',async(req, res)=> {
  let cartcount=0;
  if(req.session.user){
  cartcount=await getuserhelper.getcartcount(req.session.user._id);
    console.log(cartcount);
    if(cartcount!=null){
    req.session.user.cartsize=cartcount;
    var cartsize=req.session.user.cartsize;
    let userinfos=req.session.user;
    res.render('user/userhome',{userinfos,cartsize});
    }else
     {cartsize=0
      res.render('user/userhome',{cartsize});
      }
  }else{cartsize=0
  res.render('user/userhome',{cartsize})}

 
  
});
router.get('/section/:categorys',async(req,res)=>{
  const {categorys}=req.params;
  if(req.session.user){
    cartcount=await getuserhelper.getcartcount(req.session.user._id);
    if(cartcount!=null){
      req.session.user.cartsize=cartcount;
      var cartsize=req.session.user.cartsize;
     }}
  if(categorys==='mobiles'){
    getuserhelper.getproductsfromcart(categorys).then((productarray)=>{
      res.render('user/myproducts',{productarray,categorys,"userinfos":req.session.user,cartsize})
    })
  }
  else if(categorys=== 'laptops'){
    getuserhelper.getproductsfromcart(categorys).then((productarray)=>{
      res.render('user/myproducts',{productarray,categorys,"userinfos":req.session.user,cartsize})
    })
  }
  else if(categorys=== 'tablets'){
    getuserhelper.getproductsfromcart(categorys).then((productarray)=>{
      res.render('user/myproducts',{productarray,categorys,"userinfos":req.session.user,cartsize})
    })
  }
  else if(categorys=== 'smartwatch'){
    getuserhelper.getproductsfromcart(categorys).then((productarray)=>{
      res.render('user/myproducts',{productarray,categorys,"userinfos":req.session.user,cartsize})
    })
  }
  else
  {res.send('error phoo')}
})
router.get('/login',(req,res)=>{
  if(req.session.user)
  {res.redirect('/')}
  else if(req.session.userloginerror){
  res.render('user/login',{'loginError':req.session.userloginerror})
  req.session.userloginerror=false;}
  else if(req.session.useremailerr){
    res.render('user/login',{'Emailerr':req.session.useremailerr})
    req.session.useremailerr=false;
  }
  else{
    res.render('user/login')
  }
})
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/signup',(req,res)=>{
  getuserhelper.signupdatasfunc(req.body).then((returnedarray)=>{
  
   // console.log(returnedarray);
    req.session.user=returnedarray;
    req.session.user.loggcheck=true;
    res.redirect('/')
  })
})
router.post('/login',(req,res)=>{
  getuserhelper.loginfunc(req.body)
  .then((response)=>{
    if(response.result===true){
    req.session.user=response.user;
    req.session.user.loggcheck=true;
    console.log(req.session.user);
    res.redirect('/')
    }
    else if(response.result===false){
      req.session.userloginerror=true;
      res.redirect('/login')
    }
    else{
      req.session.useremailerr=true;
      res.redirect('/login')
    }
  })
})
router.get('/logout',(req,res)=>{
 // req.session.destroy();
 req.session.user=null;
  res.redirect('/');
})
router.get('/cart',verifyLogin,async(req,res)=>{
  
  let pro=await getuserhelper.getcartItemsfunc(req.session.user._id);
  console.log(pro);
  let totalprice=0;
  let cartsize=await getuserhelper.getcartcount(req.session.user._id);
  if(pro.length>0){
  let totalvalue=await getuserhelper.gettotalamountfunc(req.session.user._id);
  console.log(totalvalue);
  totalprice=totalvalue[0].total; 
  res.render('user/cart',{pro,userinfos:req.session.user,totalprice,cartsize})}
  else{
    res.render('user/cart',{userinfos:req.session.user,totalprice})

  }
  
})
router.get('/section/:category/addtocart/:productid',(req,res)=>{
 console.log('BUTTON CLICKeddddd');
  getuserhelper.addtocartfunc(req.params.productid,req.session.user._id)
  .then((resultvalue)=>{
   // console.log(resultvalue);
     res.json({status:true})
  })
})
router.post('/change-product-quantity',async(req,res)=>{
  await getuserhelper.changecountfunc(req.body).then(async(result)=>{
    let totalvalue=await getuserhelper.gettotalamountfunc(req.session.user._id);
    let cartcount=await getuserhelper.getcartcount(req.session.user._id);
    console.log('cart size is'+cartcount);

    res.json({result,totalvalue,cartcount});
  })
})
router.get('/place-order/:totalprice',verifyLogin, async(req,res)=>{
  let totalvalue=req.params.totalprice;
  //console.log(totalvalue);
  res.render('user/place-order',{totalvalue,userinfos:req.session.user})
})
router.post('/place-order',verifyLogin,async(req,res)=>{
 // console.log(req.body);
  let orderdproducts=await getuserhelper.getorderedproductsfunc(req.body.userId);
 // console.log(orderdproducts);
  let fullorderderails=await getuserhelper.placeorderfunc(req.body,orderdproducts);
  //console.log(fullorderderails);
  res.json({status:true})
})
router.get('/ordersuccess',verifyLogin,(req,res)=>{
    res.render('user/ordersuccess',{userinfos:req.session.user})
})
router.get('/orders',verifyLogin,async(req,res)=>{
  let orders=await getuserhelper.getUserOrders(req.session.user._id);
    res.render('user/orders',{userinfos:req.session.user,orders})
})
router.get('/vieworderproducts/:id',verifyLogin,async(req,res)=>{
    let products=await getuserhelper.getOrderProducts(req.params.id);
   // console.log(products);
    res.render('user/vieworderproducts',{userinfos:req.session.user,products})
})
router.get('/profile',verifyLogin,(req,res)=>{
  res.render('user/profileview',{userinfos:req.session.user})
})
router.post('/profile',verifyLogin,(req,res)=>{
  console.log(req.body);
  getuserhelper.updateprofilefunc(req.body,req.session.user._id).then((response)=>{
    //console.log(response);
    res.redirect('/')
  })
})
module.exports = router;
