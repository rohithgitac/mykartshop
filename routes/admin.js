const { response } = require('express');
var express = require('express');
var router = express.Router();
var categoryhelp = require('../helpers/categoryhelper');
const adminhep = require('../helpers/adminhelper');
const db= require('../configuration/connection');
const collect4admin =require('../configuration/collections');
/* GET users listing. */

function verifyadminlogin(req,res,callback){
  if(req.session.admin){
    callback()
  }
  else{
    res.redirect('/admin')
  }

}


router.get('/',(req, res)=> {
  if(req.session.admin){
  let adminsuccess=req.session.admin;
  res.render('admin/adminlogin',{admin:true,adminsuccess})}
  else if(req.session.adminpassworderror){
  res.render('admin/adminlogin',{admin:true,'PasswordError':req.session.adminpassworderror})
  req.session.adminpassworderror=false;}
  else if(req.session.adminemailerr){
    res.render('admin/adminlogin',{admin:true,'EmailError':req.session.adminemailerr})
    req.session.adminemailerr=false;
  }
  else{
    res.render('admin/adminlogin',{admin:true})
  }
  
});
router.post('/adminlogin',(req,res)=>{
  console.log(req.body);
  let admin=false;
  if(admin)
  adminhep.signindatasfunc().then(()=>{
    console.log(res);
    admin=false;
  })
  else{
    adminhep.logincheckfunc(req.body).then((checkstatus)=>{
     // console.log(checkstatus);
      if(checkstatus.status){
        let checkedstatus=checkstatus.status;
        req.session.admin=checkstatus;
        req.session.adminlogcheck=true;
        res.redirect('/admin')
      }
      else if(checkstatus.passwordstatus){
        console.log('true email');
        req.session.adminpassworderror=checkstatus.passwordstatus;
        res.redirect('/admin')
      }
      else if(checkstatus.email){
        req.session.adminemailerr=checkstatus.email;
        res.redirect('/admin')
      }
    })
  }
})
router.get('/adminlogout',(req,res)=>{
  req.session.admin=null;
  res.redirect('/admin')
})
router.get('/allproducts',verifyadminlogin, async(req,res)=>{
  await adminhep.getallproductsfunc().then((productsall)=>{
    res.render('admin/all-adminproducts',{productsall,admin:true,adminsuccess:req.session.admin})
  })
})

router.get('/category/:changer',verifyadminlogin, (req,res)=>{
  const {changer} = req.params;
  if(changer=== 'mobileproducts')
   {
    categoryhelp.getmobilefunc(changer).then((mobilesarray)=>{
    res.render('admin/category/viewmobile',{mobilesarray,admin:true,adminsuccess:req.session.admin})})
   }
   else if(changer === 'laptopproducts'){
    categoryhelp.getmobilefunc(changer).then((mobilesarray)=>{
    res.render('admin/category/viewlaptop',{mobilesarray,admin:true,adminsuccess:req.session.admin})}) }
   else if(changer ==='tabletproducts'){
    categoryhelp.getmobilefunc(changer).then((mobilesarray)=>{
    res.render('admin/category/viewtablet',{mobilesarray,admin:true,adminsuccess:req.session.admin})}) }
   else if(changer==='smartwatchproducts') {
    categoryhelp.getmobilefunc(changer).then((mobilesarray)=>{
    res.render('admin/category/viewsmartwatch',{mobilesarray,admin:true,adminsuccess:req.session.admin})})}
   else
   res.send('Invalid URL error ')
})
router.get('/category/:allproducts/add-mobile',verifyadminlogin,(req,res)=>{
  let {allproducts}=req.params;

  if(allproducts==='mobileproducts'){
  res.render('admin/category/addmobile',{admin:true,allproducts,adminsuccess:req.session.admin})
  }
  else if(allproducts==='laptopproducts'){
    res.render('admin/category/addmobile',{admin:true,allproducts,adminsuccess:req.session.admin});
  }
  else if(allproducts==='tabletproducts'){
    res.render('admin/category/addmobile',{admin:true,allproducts,adminsuccess:req.session.admin});
  }
  else if(allproducts==='smartwatchproducts'){
    res.render('admin/category/addmobile',{admin:true,allproducts,adminsuccess:req.session.admin});
  }
  else {
    res.send('Invalid urlss');}

})
router.post('/category/:allproducts/add-mobile',verifyadminlogin,async(req,res)=>{
  let {allproducts} = req.params;
  //console.log(allproducts);
  await db.get().collection(collect4admin.ALLPRODUCT_COLLECTION).insertOne(req.body)
  .then((productfulldet)=>{
  let proid=productfulldet.insertedId;
  //console.log(proid);
  if(req.files?.Image){
    let img =req.files.Image;
    img.mv('./public/allproductimages/'+proid+'.jpg')
  } }) 
  if(allproducts==='mobileproducts')
  {
    categoryhelp.addmobilefunc(req.body,allproducts).then((mobileid)=>{
      if(req.files?.Image){
      let img =req.files.Image;
      img.mv('./public/mobilesimages/'+mobileid+'.jpg',(err,done)=>{
      if(!err)
      {res.redirect('/admin/category/mobileproducts')}
      else
      {console.log(err);}
     })}else{{res.redirect('/admin/category/mobileproducts')}}
    })
  }
  else if(allproducts==='laptopproducts')
  {
    categoryhelp.addmobilefunc(req.body,allproducts).then((mobileid)=>{
      if(req.files?.Image){
      let img =req.files.Image;
      img.mv('./public/laptopsimages/'+mobileid+'.jpg',(err,done)=>{
      if(!err)
      {res.redirect('/admin/category/laptopproducts')}
      else
      {console.log(err);}
     })}else{res.redirect('/admin/category/laptopproducts')}
    })
  }
  else if(allproducts==='tabletproducts')
  {
    categoryhelp.addmobilefunc(req.body,allproducts).then((mobileid)=>{
      if(req.files?.Image){
      let img =req.files.Image;
      img.mv('./public/tabletsimages/'+mobileid+'.jpg',(err,done)=>{
      if(!err)
      {res.redirect('/admin/category/tabletproducts')}
      else
      {console.log(err);}
     })}else{res.redirect('/admin/category/tabletproducts')}
    })
  }
  else if(allproducts==='smartwatchproducts')
  {
    categoryhelp.addmobilefunc(req.body,allproducts).then((mobileid)=>{
      if(req.files?.Image){
      let img =req.files.Image;
      img.mv('./public/smartwatchimages/'+mobileid+'.jpg',(err,done)=>{
      if(!err)
      {res.redirect('/admin/category/smartwatchproducts')}
      else
      {console.log(err);}
     })}else{res.redirect('/admin/category/smartwatchproducts')}
    })
  }
})
router.get('/:categoryname/deleteproduct/',verifyadminlogin,(req,res)=>{
  let deletecategory=req.params.categoryname;
  let deleteproductid= req.query.id;
  adminhep.deleteadminproducts(deletecategory,deleteproductid).then((reply)=>{
    //console.log(reply);
    if(deletecategory==='mobileproducts'){
    res.redirect('/admin/category/mobileproducts');}
    else if(deletecategory==='laptopproducts'){
    res.redirect('/admin/category/laptopproducts');}
    else if(deletecategory==='tabletproducts'){
    res.redirect('/admin/category/tabletproducts');}
    else if(deletecategory==='smartwatchproducts'){
    res.redirect('/admin/category/smartwatchproducts');}
  })
})
router.get('/:categoryname/editproduct/',verifyadminlogin,(req,res)=>{
  let editcategory=req.params.categoryname;
  let editproductsid=req.query.id;
  //console.log(editproductsid);
  adminhep.editadminproducts(editcategory,editproductsid).then((productobj)=>{
    if(editcategory==='mobileproducts'){
    res.render('admin/edit-products',{productobj,admin:true,editcategory,adminsuccess:req.session.admin});}
    else if(editcategory==='laptopproducts'){
    res.render('admin/edit-products',{productobj,admin:true,editcategory,adminsuccess:req.session.admin});}
    else if(editcategory==='tabletproducts'){
    res.render('admin/edit-products',{productobj,admin:true,editcategory,adminsuccess:req.session.admin});}
    else if(editcategory==='smartwatchproducts'){
    res.render('admin/edit-products',{productobj,admin:true,editcategory,adminsuccess:req.session.admin});}
  })  
})
router.post('/:categoryname/editproduct/:id',verifyadminlogin,async(req,res)=>{
  await adminhep.updateadminproducts(req.params.categoryname,req.body,req.params.id).then(()=>{
    res.redirect('/admin')

    if(req.files?.Image){
      let img=req.files.Image;
      img.mv('./public/allproductimages/'+req.params.id+'.jpg')
      if(req.params.categoryname==='mobileproducts')
      img.mv('./public/mobilesimages/'+req.params.id+'.jpg');
      else if(req.params.categoryname==='laptopproducts')
      img.mv('./public/laptopsimages/'+req.params.id+'.jpg');
      else if(req.params.categoryname==='tabletproducts')
      img.mv('./public/tabletsimages/'+req.params.id+'.jpg');
      else if(req.params.categoryname==='smartwatchproducts')
      img.mv('./public/smartwatchimages/'+req.params.id+'.jpg');
    }
  })
})

router.get('/viewusers',verifyadminlogin,(req,res)=>{
  adminhep.getusersinfofunc().then((usersdata)=>{

    res.render('admin/view-users',{admin:true,usersdata,adminsuccess:req.session.admin})
  })

})

router.get('/vieworders',verifyadminlogin,(req,res)=>{
  adminhep.getordersinfofunc().then((ordersdata)=>{

   res.render('admin/view-orders',{admin:true,ordersdata,adminsuccess:req.session.admin})
  })

})

router.get('/changeorderstatus/:userid/:orderid',(req,res)=>{
  let userid= req.params.userid;
  let orderid= req.params.orderid;
  console.log(userid,orderid);
  res.render('admin/changeOrderstatus',{userid,orderid,admin:true,adminsuccess:req.session.admin})
  
})
router.post('/changeorderstatus/:userid/:orderid',(req,res)=>{
//console.log(req.body);
adminhep.changeorderstatusfunc(req.body).then((reslt)=>{
 // console.log(reslt);
  res.redirect('/admin/vieworders');
})
})
router.get('/vieworderproducts/:orderid',(req,res)=>{
  let orderid=req.params.orderid
  adminhep.getAdminOrderProducts(orderid).then((prolist)=>{
    console.log(prolist);
    res.render('admin/view-order-products',{prolist,admin:true,adminsuccess:req.session.admin})
  })
})

module.exports = router;
