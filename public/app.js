$(document).ready(function() {
  hanLec.init();
})

var hanLec = {
  url: {
    getLecturer: "/lecturers/",
    createLecturer: "/lecturers/"
  },
  init: function() {
    hanLec.events()
    hanLec.styling()
  },
  events: function() {
    $('input[name["create-lecturer"]]').on('click', function(event) {
      event.preventDefault();
      var lecturer = hanLec.getLecturerInfo();
      hanLec.createLecturer(lecturer);
    })
  },
  styling: function() {

  },
  getLecturers: function() {
    $.ajax({
      method: 'GET',
      url: hanLec.url.getLecturer,
      success: function(lecturerData) {
        console.log("RECEIVED LECTURERS", lecturerData);

      },
      error: function(err) {
        console.log('oh shit', err);
      }
    })
  },
  createLecturer: function(lecturer) {
    $.ajax({
      method: 'POST',
      url: hanLec.url.createLecturer,
      data: lecturer,
      success: function(createdLecturer) {
        console.log("CREATED LECTURER", createdLecturer);
      },
      error: function(err) {
        console.log("not workee", err);
      }
    })
  },
  getLecturerInfo: function() {
    var name = $('input[name="name"]').val();
    var topic = $('input[name="topic"]').val();
    var image = $('input[name="image"]').val();
    return {
      name: name,
      topic: topic,
      image: image
    };
  },
  updateLecturer: function(id) {

  },
  deleteLecturer: function(id) {

  },
  createRating: function(rating) {

  },
  getRatings: function(lecturerId) {

  }
}
