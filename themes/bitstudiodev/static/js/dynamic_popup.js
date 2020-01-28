function togglePopUp() {
  var myButtonClasses = document.getElementById("modal").classList;

  if (myButtonClasses.contains("is-hidden")) {
    myButtonClasses.remove("is-hidden");
  } else {
    myButtonClasses.add("is-hidden");
  }
  if (myButtonClasses.contains("is-active")) {
    myButtonClasses.remove("is-active");
  } else {
    myButtonClasses.add("is-active");
  }
}