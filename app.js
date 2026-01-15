function btn(value) {
    var display = document.getElementById("child1");
    display.innerText += value
}
function del() {
      var display = document.getElementById("child1");
      display.innerText = display.innerText.slice(0,display.innerText.length-1)
}
function remove() {
     var display = document.getElementById("child1");
     display.innerText = display.innerText.slice(0,0)
}
function result() {
      var display = document.getElementById("child1");
      var display2 = document.getElementById("child2");
    display2.innerText = (eval(display.innerText))
}