function showDropdown() {
    document.getElementById("menu-drop").classList.toggle("show");
    console.log("Clicked");
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('isinavbar')) {
      var dropdowns = document.getElementsByClassName("isinavbar");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  } 