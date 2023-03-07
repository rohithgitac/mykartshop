function addtofunc(cat,proid,proname){
  let count=document.getElementById('cart-count').innerHTML;
  countnum=parseInt(count)
  $.ajax({
    url:'/section/'+cat+'/addtocart/'+proid,
    method:'get',
    success:()=>{
      alert( proname+' added to your cart..!!')
      document.getElementById('cart-count').innerHTML=countnum+1;
    }

  })
 
}
function changeQuantity(cartId,proId,count)
{
   let quantity=parseInt(document.getElementById(proId).innerHTML);
    count=parseInt(count)
    if(count===-2)     //For remove button
    {quantity=1;
     count=-1;}
    else
    {quantity=quantity;
    count=count;}
    //console.log(userId)
    $.ajax({
        url:'/change-product-quantity',
        data:{
            cart:cartId,
            product:proId,
            count:count,
            quantity:quantity
        },
        method:'post',
        success:(response)=>{
            if(response.result.removedstatus){
                alert('Product has been removed from cart..!!!')
                location.reload()
            }
            else{
                console.log(response);
                document.getElementById(proId).innerHTML=quantity+count;
                document.getElementById('total').innerHTML=response.totalvalue[0].total;
                document.getElementById('cart-count').innerHTML=response.cartcount;
                document.getElementById('placeorder').href="/place-order/"+response.totalvalue[0].total;
                console.log(response.cartcount);
              
            }
        }

    })

}