wikiRateOrg = 'https://wikirate.org/';

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
    success: (function (data) {
      initChart(data, this.visId);
    })
  });
};

initChart = function (spec, id) {
  initVega(prepareVegaSpec(spec),  $("#" + id));
};

handleChartClicks = function (v, el) {
  return v.addEventListener('click', function (_event, item) {
    wikiRateChartLink(item.datum, el);
  });
};

wikiRateChartLink = function (datum, el) {
  wrPage = datum.wikirate_page || wikiRatePage(el);
  filter = datum.filter;
  if (filter && wrPage) {
    openWikiRate(wrPage, filterParams(filter));
  }
}

openWikiRate = function (page, query) {
  url = wikiRateOrg + page + '?' + query;
  window.open(url, "_blank");
}

wikiRatePage = function (el) {
  return el.data("wikirate_page") || el.closest(".chart").data("wikirate_page");
}

filterParams = function (filter) {
  filter ||= {};
  filter["company_group"] = filterGroups();
  filter["year"] ||= "latest";
  return $.param({ filter: filter });
}

filterGroups = function () {
  groups = ["MSA Asset Managers"];
  current = currentGroup();
  if (current) { groups.push(current) }
  return groups;
}

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
  opts = {
    renderer: "svg",
    actions: {
      source: false,
      editor: true
    }
  }
  vegaEmbed(el[0], spec, opts).then(function(result) {
    handleChartClicks(result.view, el)
  }).catch(console.error);
  // return new vega.View(runtime, { renderer: "svg" }).initialize(el).hover().run();
  //return
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

  $(".metric-link").on("click", function (event) {
    openWikiRate(wikiRatePage($(this)), filterParams());
    event.preventDefault();
  });
});
