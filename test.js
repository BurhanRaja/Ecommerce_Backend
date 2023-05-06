let num = Math.ceil(Math.random() * 35);
if (num < 30) {
    num += 1;
}
let reciept = (Math.random()).toString(num).substring(2);

console.log(reciept);