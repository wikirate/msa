vizUrl = function (id) {
  return '../json/' + id + '.json'
}

loadViz = function (viz) {
  id = viz.attr('id')
  return $.ajax({
    url: vizUrl(id),
    dataType: "json",
    visId: id,
    type: "GET",
    success: function (data) {
      initChart(data, this.visId);
    }
  });
};

initChart = function (spec, id) {
  el = $("#" + id);
  initVega(spec, el[0]);
};

// handleChartClicks = function (vega, el) {
//   return vega.addEventListener('click', function (_event, item) {
//     var d;
//     if (!el.closest("._filtered-content").exists()) {
//       return;
//     }
//     d = item.datum;
//     if (d.filter) {
//       return updateFilter(el, d.filter);
//     } else if (d.details) {
//       return updateDetails(d.details);
//     }
//   });
// };

initVega = function (spec, el) {
  var runtime;
  runtime = vega.parse(spec);
  return new vega.View(runtime).initialize(el).hover().run();
};

$(document).ready(function() {
  $(".viz").each(function () {
    loadViz($(this));
  });
});
