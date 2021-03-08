vizUrl = function (id) {
  return 'json/' + id + '.json'
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
  initVega(prepareVegaSpec(spec), $("#" + id)[0]);
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


prepareVegaSpec = function (spec) {
  group = currentGroup();
  if (group) {
    restrictToGroup(spec["data"], group);
  }
  return spec;
}

restrictToGroup = function(data, group) {
  and_query = '&filter[company_group][]=' + encodeURIComponent(group);
  $.each(data, function(i, hash) {
    if (hash["url"]) {
      hash["url"] = hash["url"] + and_query
    }
  });
}

initVega = function (spec, el) {
  runtime = vega.parse(spec);
  return new vega.View(runtime, { renderer: "svg" }).initialize(el).hover().run();
};

currentGroup = function () {
  return $(".filter-dropdown").data("currentGroup");
}

updateCurrentGroup = function (group) {
  $(".filter-dropdown").data("currentGroup", group);
}

loadAllViz = function () {
  $(".viz").each(function () {
    loadViz($(this));
  });
}

updateFilter = function (item) {
  if (item.hasClass("reset-item")) {
    item.parent().hide();
    text = "Filter the Data";
  } else {
    text = "Filtering: " + item.text();
    $(".reset-item-li").show()
  }
  $(".filter-dropdown .dropdown-toggle").text(text);
}

$(document).ready( function () {
  loadAllViz();

  $(".filter-dropdown .dropdown-item").on("click", function (event) {
    item = $(this);
    updateCurrentGroup(item.data("group"));
    updateFilter(item);
    $(".viz").html("");
    loadAllViz();
    event.preventDefault();
  });
});
