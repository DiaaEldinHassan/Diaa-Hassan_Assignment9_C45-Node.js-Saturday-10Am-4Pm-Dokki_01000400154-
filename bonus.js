function commonPrefix(arr)
{
    if(arr.length===0)return"";
    for (let i = 0; i <  arr[0].length; i++) {
        if(!arr.every((a)=>a[i]===arr[0][i])){
            return arr[0].slice(0,i);
        }
    }
    return arr[0];
}

console.log(commonPrefix(["flower","flow","flight"]))