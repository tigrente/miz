miz.filter('range', function() {
  return function (input, total) {
    total = parseInt(total);
    
    for (i = 0; i < total; i++) {
      input.push(i);
    }

    return input;
  }
});