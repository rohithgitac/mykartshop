const db = require('../configuration/connection');
const collectdb = require('../configuration/collections');
const bcrypt = require('bcrypt');
const { ObjectID } = require('bson');
const { response } = require('express');


module.exports = {
    getproductsfromcart:(category)=>{
        if(category==='mobiles'){
        return new Promise (async(resolve,reject)=>{
            mobiles=await db.get().collection(collectdb.MOBILE_COLLECTION).find().toArray()
            resolve(mobiles);
        })
        }
        else if (category==='laptops'){
            return new Promise (async(resolve,reject)=>{
                laptops=await db.get().collection(collectdb.LAPTOP_COLLECTION).find().toArray()
                resolve(laptops);
            })

        }
        else if (category==='tablets'){
            return new Promise (async(resolve,reject)=>{
                tablets=await db.get().collection(collectdb.TABLET_COLLECTION).find().toArray()
                resolve(tablets);
            })

        }
        else if (category==='smartwatch'){
            return new Promise (async(resolve,reject)=>{
                smartwatch=await db.get().collection(collectdb.SMARTWATCH_COLLECTION).find().toArray()
                resolve(smartwatch);
            })

        }
    },
    signupdatasfunc:(signupdatas)=>{
        return new Promise(async(resolve,reject)=>{
            signupdatas.password=await bcrypt.hash(signupdatas.password,10);
            await db.get().collection(collectdb.USER_COLLECTION).insertOne(signupdatas)
            .then(()=>{
                resolve(signupdatas)
            })

        })
    },
    loginfunc:(logininfo)=>{
        let loggincheck = false;
        let response={};
        return new Promise(async(resolve,reject)=>{
            let userinfo=await db.get().collection(collectdb.USER_COLLECTION).findOne({email:logininfo.email})
            if(userinfo){
                bcrypt.compare(logininfo.password,userinfo.password).then((result)=>{
                    console.log(result);
                    if(result){
                        console.log('LOGIN SUCCESS TRUE USER....!!!');
                        response.user=userinfo;
                        response.result=true;
                        resolve(response);
                    }else{
                        console.log('LOGIN FAILED INCORRECT PASSWORD...!!!!');
                        resolve({result:false})
                    }
                })            
            }
            else
            {console.log('LOGIN FAILED INCORRECT EMAIL ID..!!!!!');
             resolve({emailid:true})}
        })

    },
    addtocartfunc:(productid,userid)=>{
        let itemandquantity={item:ObjectID(productid),
                            quantity:1}
        return new Promise(async(resolve,reject)=>{
            let cartexist=await db.get().collection(collectdb.CART_COLLECTION).findOne({user:ObjectID(userid)})
            if(cartexist){
                let productindex=await cartexist.products.findIndex(products=>products.item==productid)
                console.log(productindex+'this is');
                if(productindex!=-1){
                    console.log("its confirmed..........."+userid);
                    await db.get().collection(collectdb.CART_COLLECTION)
                    .updateOne({user:ObjectID(userid),'products.item':ObjectID(productid)},
                    {$inc:{'products.$.quantity':1}})
                    .then((counter)=>{
                        console.log(counter);
                        resolve(counter)
                    })
                }
                else{
                let existresult=await db.get().collection(collectdb.CART_COLLECTION).updateOne({user:ObjectID(userid)},
                {
                    $push:{products:itemandquantity}
                })
                console.log(existresult);
                resolve(existresult)
                }
            }
            else{
                cartobj={
                    user:ObjectID(userid),
                    products:[itemandquantity]

                }
                await db.get().collection(collectdb.CART_COLLECTION).insertOne(cartobj).then((acknow)=>{
                    console.log(acknow);
                    resolve(acknow)

                })
            }
        })
        
    },
    getcartItemsfunc:(userid)=>{
        return new Promise((resolve,reject)=>{
            let kartitems= db.get().collection(collectdb.CART_COLLECTION).aggregate([
                {$match:{user:ObjectID(userid)}},
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collectdb.ALLPRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'allproducts'
                    }
                },
                {
                    $project:{
                        item:1,
                        quantity:1,
                        product:{$arrayElemAt:['$allproducts',0]}

                    }
                }
            ]).toArray()
            resolve(kartitems);
        })
    },
    getcartcount:(userid)=>{
        let count = 0
        return new Promise(async(resolve,reject)=>{
        let cart=await db.get().collection(collectdb.CART_COLLECTION).findOne({user:ObjectID(userid)})
        if(cart){
            for(let i=0;i<cart.products.length;i++){
            count+=cart.products[i].quantity;
            }
        resolve(count);}
        else{
            resolve(0)
        }
        })
    },
    changecountfunc:(objects)=>{
        let count=parseInt(objects.count)
        let qa=parseInt(objects.quantity);
        console.log(qa);
        console.log(count);
        return new Promise(async(resolve,reject)=>{
            if(objects.count==-1&& objects.quantity==1){
                await db.get().collection(collectdb.CART_COLLECTION)
                .updateOne({_id:ObjectID(objects.cart),'products.item':ObjectID(objects.product)},
                {
                    $pull:{products:{item:ObjectID(objects.product)}}
                });
                resolve({removedstatus:true})
            }
            else{
            await db.get().collection(collectdb.CART_COLLECTION)
                    .updateOne({_id:ObjectID(objects.cart),'products.item':ObjectID(objects.product)},
                    {$inc:{'products.$.quantity':count}}).then((response)=>{
                        resolve({updatedstatus:true})
                    })
                }        
        })
    },
    gettotalamountfunc:(userid)=>{
        return new Promise(async(resolve,reject)=>{
            let totalvalue=await db.get().collection(collectdb.CART_COLLECTION).aggregate([
                {$match:{user:ObjectID(userid)}},
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collectdb.ALLPRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'allproducts'
                    }
                },
                {
                    $project:{
                        item:1,
                        quantity:1,
                        product:{$arrayElemAt:['$allproducts',0]}

                    }
                },
                {
                    $group:{
                        _id:null,
                        total:{$sum:{$multiply:['$quantity',{$toInt:'$product.price'}]}}
                    }
                }
            ]).toArray()
            console.log(totalvalue);
            resolve(totalvalue)
        })
    },
    placeorderfunc:(orderDetailsUseridTotal,productlist)=>{
        console.log(orderDetailsUseridTotal,productlist);
        return new Promise(async(resolve,reject)=>{
            let selection=orderDetailsUseridTotal['payment-method']==='COD'?'placed':'pending'
            let orderobj={
                address:{
                name:orderDetailsUseridTotal.name,
                Firstaddress:orderDetailsUseridTotal.address1,
                Secondaddress:orderDetailsUseridTotal.address2,
                mobile:orderDetailsUseridTotal.mobile,
                pincode:orderDetailsUseridTotal.pincode},
                date:new Date(),
                user:ObjectID(orderDetailsUseridTotal.userId),
                total:orderDetailsUseridTotal.totalamount,
                paidMethod:orderDetailsUseridTotal['payment-method'],
                productsinfo:productlist,
                status:selection,
                orderStatus:{
                    status:"Not available",
                    updatedTime:null,
                    ExpectedDeliveryDate:"Within 10 days"
                }

            }
            let orderdb=await db.get().collection(collectdb.ORDER_COLLECTION).insertOne(orderobj);
            await db.get().collection(collectdb.CART_COLLECTION).deleteOne({user:ObjectID(orderDetailsUseridTotal.userId)})
           // console.log(orderdb);
            resolve(orderdb);
        })


    },
    getorderedproductsfunc:(userid)=>{
        return new Promise(async(resolve,reject)=>{
            let cart=await db.get().collection(collectdb.CART_COLLECTION).findOne({user:ObjectID(userid)})
           // console.log(cart.products);
            resolve(cart.products)
        })
    },
    getUserOrders:(userId)=>{
    return new Promise(async(resolve,reject)=>{
    let orders=await db.get().collection(collectdb.ORDER_COLLECTION)
        .find({user:ObjectID(userId)}).toArray()
        resolve(orders)
        })
    },
    getOrderProducts:(orderId)=>{
    return new Promise(async(resolve,reject)=>{
    let orderItems=await db.get().collection(collectdb.ORDER_COLLECTION).aggregate([
    {
        $match:{_id:ObjectID(orderId)}
    },
    {
        $unwind:'$productsinfo'
    },
    {
        $project:{
        total:'$total',
        item:'$productsinfo.item',
        quantitycount:'$productsinfo.quantity',
        }
    },
    {    $lookup:{
         from:collectdb.ALLPRODUCT_COLLECTION,
         localField:'item',
        foreignField:'_id',
        as:'product',
        }
    },
    {
        $unwind:'$product'      //OR use project option written below both gives same result
    }
    // {
    //     $project:{
    //     item:1,quantitycount:1,product:{$arrayElemAt:['$product',0]}
    //     }
    // }
    ]).toArray()
    //console.log(orderItems);
    resolve(orderItems)             
    })    
    },
    updateprofilefunc:(updateddata,usrid)=>{
        return new Promise(async(resolve,reject)=>{
            updateddata.password=await bcrypt.hash(updateddata.password,10);
            let updatestatus= db.get().collection(collectdb.USER_COLLECTION).updateOne({_id:ObjectID(usrid)},
                {
                    $set:{name:updateddata.name,
                        password:updateddata.password,
                        mobile:updateddata.mobile,
                        address:updateddata.address
                    }
                })
            resolve(updatestatus)    
        }
        )
    },

    performSearch : (query)=> {
        return new Promise(async(resolve,reject)=>{
            const keyword = {
                $or:[
                {name : {$regex : query,  $options : 'i'}},
                {category:{$regex : query, $options : 'i'}}
            ]
            }
            let searchProducts=await db.get().collection(collectdb.ALLPRODUCT_COLLECTION)
                                                .find({...keyword}).toArray()
            resolve(searchProducts)
        })
    }

}