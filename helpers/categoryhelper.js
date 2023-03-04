var db = require('../configuration/connection');
var collect =require('../configuration/collections')

module.exports={
    addmobilefunc:(mbproducts,catstring)=>
    {
    
    if(catstring==='mobileproducts')
    {
        return new Promise(async(resolve,reject)=>{
        mobiles= await db.get().collection(collect.MOBILE_COLLECTION).insertOne(mbproducts)
        resolve(mobiles.insertedId)
        })
    }
    else if(catstring==='laptopproducts'){       
        return new Promise(async(resolve,reject)=>{
            laptops= await db.get().collection(collect.LAPTOP_COLLECTION).insertOne(mbproducts)
            resolve(laptops.insertedId)
            })
        }
    else if(catstring==='tabletproducts'){       
        return new Promise(async(resolve,reject)=>{
            tablets= await db.get().collection(collect.TABLET_COLLECTION).insertOne(mbproducts)
            resolve(tablets.insertedId)
            })
        }
    else if(catstring==='smartwatchproducts'){
        
        return new Promise(async(resolve,reject)=>{
            smartwatch= await db.get().collection(collect.SMARTWATCH_COLLECTION).insertOne(mbproducts)
            resolve(smartwatch.insertedId)
            })
        }
    },

    getmobilefunc:(catstring)=>{
        if(catstring==='mobileproducts'){   
            return new Promise(async(resolve,reject)=>{
            let mobiles =await db.get().collection(collect.MOBILE_COLLECTION).find().toArray()
            resolve(mobiles)
            })
        }
        else if(catstring==='laptopproducts'){
            return new Promise(async(resolve,reject)=>{
                let laptops =await db.get().collection(collect.LAPTOP_COLLECTION).find().toArray()
                resolve(laptops)
            })
        }  
        else if(catstring==='tabletproducts'){
            return new Promise(async(resolve,reject)=>{
                let tablets =await db.get().collection(collect.TABLET_COLLECTION).find().toArray()
                resolve(tablets)
            })
        }
        else if(catstring==='smartwatchproducts'){
            return new Promise(async(resolve,reject)=>{
                let smartwatch =await db.get().collection(collect.SMARTWATCH_COLLECTION).find().toArray()
                resolve(smartwatch)
            })
        }  
    }
}



