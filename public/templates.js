var templates = {
  lecturers: [
    "<div class='lecturer' data-id='<%= id %>'>",
    "<h6><%= name %></h6>",
    "<h6><%= topic %></h6>",
    "<div class='lecturer-face'>",
    "<img src='<%= image %>'>",
    "<button data-id='<%= id %>'> SHOW RATINGS </button>"
    "</div>"
  ].join(""),
  ratings: [
    "<div class='rating'>",
    "<ul><li><%= author %> </li>",
    "<li><%= text %> </li>",
    "<li><%= isGood %></li></ul></div>"
  ].join("")
}
