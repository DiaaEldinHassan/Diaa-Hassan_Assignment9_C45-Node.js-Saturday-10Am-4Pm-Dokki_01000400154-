
export function checkUpperCase(str) {
    let splitted=str.toLowerCase().split(" ");

   for (let i = 0; i < splitted.length; i++) {
    splitted[i]=splitted[i][0].toUpperCase()+splitted[i].slice(1);
   }
   splitted=splitted.join(" ")
    return splitted;
}
