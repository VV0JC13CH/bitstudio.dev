function dynamicSearch() {
  // Declare variables
  var input, filter, nav, header, a, i, txtValue;
  input = document.getElementById('searchInput');
  filter = input.value.toUpperCase();
  nav = document.getElementById("listedArticles");
  header = nav.getElementsByTagName('a');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < header.length; i++) {
    a = header[i].getElementsByTagName("h5")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      header[i].style.display = "";
    } else {
      header[i].style.display = "none";
    }
  }
}