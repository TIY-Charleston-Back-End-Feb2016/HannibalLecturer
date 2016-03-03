$(document).ready(function() {
  hanLec.init();
})

var hanLec = {
  url: {
    getLecturer: "/lecturers",
    createLecturer: "/lecturers",
    reviews: '/reviews?lecturerId=',
    createReview: '/reviews'
  },
  init: function() {
    hanLec.events()
    hanLec.styling()
  },
  events: function() {

    $('.create-rating, .ratings').on('click',"input[name='back-to-lecturers']",function() {
      hanLec.getLecturers();
    })

    $('.lecturers').on('click',"input[name='back-to-lecturers']",function() {
      hanLec.getLecturers();
    })
    $('input[name="create-lecturer"]').on('click', function(event) {
      event.preventDefault();
      var lecturer = hanLec.getLecturerInfo();
      hanLec.createLecturer(lecturer);
    });

    $('input[name="show-lecturers"]').on('click', function(event) {
      event.preventDefault();
      hanLec.getLecturers();
    });

    $('.lecturers').on('click','img',function(event) {
      var lecturerId = $(this).parent().parent().data('id');
      console.log(lecturerId);
      $('.create-rating').removeClass('hidden').siblings().addClass('hidden');
      $('.create-rating').append("<span class='hidden'>" + lecturerId + "</span>");
      $('.create-rating').append('<input type="button" name="back-to-lecturers" value="Back To Lecturers">')
    });

    $('.create-rating').on('click','input[type="submit"]',function(event) {
      event.preventDefault();
      var rating = hanLec.getRatingInfo();
      console.log(rating);

      hanLec.createRating(rating);
    });

    $('.lecturers').on('click','button',function(event) {
      console.log($(this));
      var id = $(this).data('id');
      hanLec.getRatings(id);
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
        window.glob = lecturerData;
        hanLec.addLecturerToDom(JSON.parse(lecturerData));
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
  getRatingInfo: function() {
    var author = $('input[name="author"]').val();
    var text = $('input[name="comment"]').val();
    var isGood = document.getElementById('isGood').checked;
    var lecturerId = $('.create-rating').find('span.hidden').text();
    return {
      lecturerId: lecturerId,
      author: author,
      text: text,
      isGood: isGood
    };
  },
  updateLecturer: function(id) {

  },
  deleteLecturer: function(id) {

  },
  createRating: function(rating) {
    $.ajax({
      method: 'POST',
      url: hanLec.url.createReview,
      data: rating,
      success: function(data) {
        console.log(data);
      },
      error: function(data) {
        console.log("ERR",data);
      }
    })
  },
  getRatings: function(lecturerId) {
    $.ajax({
      method: 'GET',
      url: hanLec.url.reviews + lecturerId,
      success: function(data) {
        console.log(data);
        hanLec.addRatingsToDom(JSON.parse(data));
      }
    })
  },

  addLecturerToDom: function(lecturers) {
    $('.lecturers').html("");
    var tmpl = _.template(templates.lecturers);
    lecturers.forEach(function(lect) {
      $('.lecturers').append(tmpl(lect));
    })
    $('.lecturers').siblings().addClass('hidden');
    $('.lecturers').removeClass('hidden');
  },

  addRatingsToDom: function(ratings) {
    $('.ratings').html("");
    var tmpl = _.template(templates.ratings);
    ratings.forEach(function(rate) {
      $('.ratings').append(tmpl(rate));
    });
    $('.ratings').siblings().addClass('hidden');
    $('.ratings').removeClass('hidden');
    $('.ratings').append('<input type="button" name="back-to-lecturers" value="Back To Lecturers">')
  }
}
