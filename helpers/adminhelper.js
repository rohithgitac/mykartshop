const db= require('../configuration/connection');
const collectadmin =require('../configuration/collections');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

module.exports={
    deleteadminproducts:(productcategory,productid)=>{
        if(productcategory==='mobileproducts'){
            return new Promise(async(resolve,reject)=>{
               let status= await db.get().collection(collectadmin.MOBILE_COLLECTION).deleteOne({_id:ObjectId(productid)});
               resolve(status);
            })
        }
        else if(productcategory==='laptopproducts'){
            return new Promise(async(resolve,reject)=>{
               let status= await db.get().collection(collectadmin.LAPTOP_COLLECTION).deleteOne({_id:ObjectId(productid)});
               resolve(status);
            })
        }
        else if(productcategory==='tabletproducts'){
            return new Promise(async(resolve,reject)=>{
               let status= await db.get().collection(collectadmin.TABLET_COLLECTION).deleteOne({_id:ObjectId(productid)});
               resolve(status);
            })
        }
        else if(productcategory==='smartwatchproducts'){
            return new Promise(async(resolve,reject)=>{
               let status= await db.get().collection(collectadmin.SMARTWATCH_COLLECTION).deleteOne({_id:ObjectId(productid)});
               resolve(status);
            })
        }
    },
    editadminproducts:(category,productid)=>{
        return new Promise(async(resolve,reject)=>{
            if(category==='mobileproducts'){
            let product= await db.get().collection(collectadmin.MOBILE_COLLECTION).findOne({_id:ObjectId(productid)});
            resolve(product);
            }
            else if(category==='laptopproducts'){
            let product= await db.get().collection(collectadmin.LAPTOP_COLLECTION).findOne({_id:ObjectId(productid)});
            resolve(product);
            }
            else if(category==='tabletproducts'){
            let product= await db.get().collection(collectadmin.TABLET_COLLECTION).findOne({_id:ObjectId(productid)});
            resolve(product);
            }
            else if(category==='smartwatchproducts'){
            let product= await db.get().collection(collectadmin.SMARTWATCH_COLLECTION).findOne({_id:ObjectId(productid)});
            resolve(product);
            }
        })
    },
    updateadminproducts:(category,editedcontent,productid)=>{
        return new Promise(async(resolve,reject)=>{
            await db.get().collection(collectadmin.ALLPRODUCT_COLLECTION)
                .updateOne({_id:ObjectId(productid)},
                    {$set:{
                        name:editedcontent.name,
                        category:editedcontent.category,
                        price:editedcontent.price,
                        description:editedcontent.description
                        }
                    }
                )

            if(category==='mobileproducts'){
                let result=await db.get().collection(collectadmin.MOBILE_COLLECTION)
                .updateOne({_id:ObjectId(productid)},
                    {$set:{
                        name:editedcontent.name,
                        category:editedcontent.category,
                        price:editedcontent.price,
                        description:editedcontent.description
                        }
                    }
                )
                resolve();
            }
            else if(category==='tabletproducts'){
                let result=await db.get().collection(collectadmin.TABLET_COLLECTION)
                .updateOne({_id:ObjectId(productid)},
                    {$set:{
                        name:editedcontent.name,
                        category:editedcontent.category,
                        price:editedcontent.price,
                        description:editedcontent.description
                        }
                    }
                )
                resolve();
            }
            else if(category==='laptopproducts'){
                let result=await db.get().collection(collectadmin.LAPTOP_COLLECTION)
                .updateOne({_id:ObjectId(productid)},
                    {$set:{
                        name:editedcontent.name,
                        category:editedcontent.category,
                        price:editedcontent.price,
                        description:editedcontent.description
                        }
                    }
                )
                resolve();
            }
            else if(category==='smartwatchproducts'){
                let result=await db.get().collection(collectadmin.SMARTWATCH_COLLECTION)
                .updateOne({_id:ObjectId(productid)},
                    {$set:{
                        name:editedcontent.name,
                        category:editedcontent.category,
                        price:editedcontent.price,
                        description:editedcontent.description
                        }
                    }
                )
                resolve();
            }
            
        })
    },
    signindatasfunc:()=>{
        return new Promise(async(resolve,reject)=>{
            let adminsignupdatas={
                email:'admin@kart.com',
                password:'123'

            }
            adminsignupdatas.password=await bcrypt.hash(adminsignupdatas.password,10);
            await db.get().collection(collectadmin.ADMIN_DATAS).insertOne(adminsignupdatas);

        })
    },
    logincheckfunc:(logeddata)=>{
        let adminlogedobj={};
        //console.log(logeddata);
        return new Promise(async(resolve,reject)=>{
            let logedemail=await db.get().collection(collectadmin.ADMIN_DATAS).findOne({email:logeddata.email})
            if(logedemail){
                bcrypt.compare(logeddata.password,logedemail.password).then((result)=>{
                    console.log(result);
                    if(result){
                        adminlogedobj.details=logedemail;
                        adminlogedobj.status=true;
                        resolve(adminlogedobj)
                    }
                    else{
                        resolve({passwordstatus:true})
                    }
                })
            }
            else{
                resolve({email:true})
            }
        })
    },
    getallproductsfunc:()=>{
        return new Promise(async(resolve,reject)=>{
            let allproducts=await db.get().collection(collectadmin.ALLPRODUCT_COLLECTION).find().toArray();
           // console.log(allproducts);
            resolve(allproducts)
        })
    },
    getusersinfofunc:()=>{
        return new Promise(async(resolve,reject)=>{
            let userinfo=await db.get().collection(collectadmin.USER_COLLECTION).find().toArray()
            resolve(userinfo);

        })
    },
    getordersinfofunc:()=>{
        return new Promise(async(resolve,reject)=>{
            let orderinfo=await db.get().collection(collectadmin.ORDER_COLLECTION).find() 
            .toArray()
            //console.log(orderinfo);
            resolve(orderinfo);
        })
    },
    changeorderstatusfunc:(orderstatusobj)=>{
        let orderobject={
            status:orderstatusobj.status,
            updatedTime:orderstatusobj.time,
            ExpectedDeliveryDate:orderstatusobj.delivery
        }
        return new Promise(async(resolve,reject)=>{
           let result= await db.get().collection(collectadmin.ORDER_COLLECTION).updateOne({_id:ObjectId(orderstatusobj.order),user:ObjectId(orderstatusobj.user)},
            {
                $set:{"orderStatus":orderobject}
            })
           // console.log(result);
            resolve(result)
        })
    },
    getAdminOrderProducts:(orderId)=>{
        return new Promise(async(resolve,reject)=>{
        let orderItems=await db.get().collection(collectadmin.ORDER_COLLECTION).aggregate([
        {
            $match:{_id:ObjectId(orderId)}
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
             from:collectadmin.ALLPRODUCT_COLLECTION,
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
        }
}

