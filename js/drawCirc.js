// Thanks: https://github.com/GuanglinDu/sunburst-d3-v5

'use strict';

var datas

function updateCircData(val, ind){
  var b = circData;
  for(var i = 0; i < ind.length - 1 ; i++){
    b = b[i].children;
  }
  b[ind[ind.length-1]].size += val;
}


function toCircData(data){
  var refTree = {"name" : "circData", "children" : []};
  for (var ind in data){
      var d = data[ind];
      if(d.dealType == ""){
        continue;
      }
      var cont = true;
      var id = 0;
      for (var zd in refTree.children){
        var z = refTree.children[zd];
        if (z.name == d.dealType){
          cont = false;
          break;
        }
        id++;
      }
      if (cont){
        refTree.children.push({"name" : d.dealType , "children" : []});
      }
      var cont = true;
      var idx = 0;
      for (var zd in refTree.children[id].children){
        var z = refTree.children[id].children[zd];
        if (z.name == d.dealCat){
          cont = false;
          break;
        }
        idx++;
      }
      if(cont){
        refTree.children[id].children.push({"name" : d.dealCat , "children" : []});
      }
      var cont = true;
      var idy = 0;
      for (var zd in refTree.children[id].children[idx].children){
        var z = refTree.children[id].children[idx].children[zd];
        if (z.name == d.dealCatSub){
          cont = false;
          break;
        }
        idy++;
      }
      if(cont){
        refTree.children[id].children[idx].children.push({"name" : d.dealCatSub, "children": []})
      }
      var cont = true;
      var idz = 0;
      for (var zd in refTree.children[id].children[idx].children[idy].children){
        var z = refTree.children[id].children[idx].children[idy].children[zd];
        if (z.name == d.keyword){
          cont = false;
          break;
        }
        idz++;
      }
      if(cont){
        refTree.children[id].children[idx].children[idy].children.push({"name" : d.keyword, "size": d.value})
      }
      else {
        refTree.children[id].children[idx].children[idy].children[idz].size += d.value;
      }
    }
  console.log(refTree);
  return refTree;
}

/*
function toCircData(data){
  console.log(data);
  var refTree = {"name" : "circData", "children" : []};
  for (var ind in data){
      var d = data[ind];
      if(d.dealType == ""){
        continue;
      }
      var cont = true;
      var id = 0;
      for (var zd in refTree.children){
        var z = refTree.children[zd];
        if (z.name == d.dealType){
          cont = false;
          break;
        }
        id++;
      }
      if (cont){
        refTree.children.push({"name" : d.dealType , "children" : []});
      }
      var cont = true;
      var idx = 0;
      for (var zd in refTree.children[id].children){
        var z = refTree.children[id].children[zd];
        if (z.name == d.dealCat){
          cont = false;
          break;
        }
        idx++;
      }
      if(cont){
        if (d.dealCat == d.dealCatSub){
          refTree.children[id].children.push({"name" : d.dealCat , "size" : 0.});
        }
        else{
          refTree.children[id].children.push({"name" : d.dealCat , "children" : []});
        }
      }
      if(d.dealCat == d.dealCatSub){
        refTree.children[id].children[idx].size += d.value;
      }
      else{
        var cont = true;
        var idy = 0;
        for (var zd in refTree.children[id].children[idx].children){
          var z = refTree.children[id].children[idx].children[zd];
          if (z.name == d.dealCatSub){
            cont = false;
            break;
          }
          idy++;
        }
        if(cont){
          try{
          refTree.children[id].children[idx].children.push({"name" : d.dealCatSub, "size": d.value})
        }
        catch (errortmp){
          console.log(refTree);
          console.log(d);
          console.log([id,idx,idy]);
          console.log(refTree.children[id].children)
          throw(errortmp);
        }
        }
        else{
          refTree.children[id].children[idx].children[idy].size += d.value;
        }
      }
    }
  console.log(refTree);
  return refTree;
}
*/

/*
function toCircData(data){
  var refTree = {};
  var realTree = {"name" : "circData", "children" : []};
  var ix1 = 0;
  var ix2 = [];
  var ix3 = [];
  data.forEach(
    function(d){
      if(!(d.dealType in refTree)){
        refTree[d.dealType] = {"index" : ix1++, "children" : {}};
        ix2.push(0);
        ix3.push([]);
        realTree.children.push({"name": d.dealType, "children" : []});
      }
      if(!(d.dealCat in refTree[d.dealType].children)){
        refTree[d.dealType].children[d.dealCat] = {"index" : ix2[refTree[d.dealType].index]++, "children" : {}};
        ix3[refTree[d.dealType].index][refTree[d.dealType].children[d.dealCat].index].push(0);
        var z = realTree.children[refTree[d.dealType].index].children;
        if(d.dealCat != d.dealCatSub){
          z.push({"name" : d.dealCat, "children" : []});
        }
        else{
          z.push({"name" : d.dealCat, "size" : 0.});
        }
      }
      if(!(d.dealCatSub in refTree[d.dealType][d.dealCat])){
        refTree[d.dealType][d.dealCat][d.dealCatSub] = {"index" : ix3[refTree[d.dealType].index][refTree[d.dealType].children[d.dealCat].index]++};
        if(d.dealCat != d.dealCatSub){
          var z = realTree.children[refTree[d.dealType].index].children[refTree[d.dealType].children[d.dealCat].index].children;
          z.push({"name" : d.dealCatSub, "size" : 0.});
        }
      }
      var z = realTree.children[refTree[d.dealType].index].children;
      if(d.dealCat != d.dealCatSub){
        z[refTree[d.dealType].children[d.dealCat].children[d.dealCatSub].index].size += d.value;
      }
      else{
        z[refTree[d.dealType].children[d.dealCat].index].size += d.value;
      }
    }
  )
  return realTree;
}
*/

function drawCirc(data){

  const format = d3.format(",d");
  const width = 932;
  const radius = width / 6;

  const arc = d3.arc()
                .startAngle(d => d.x0)
                .endAngle(d => d.x1)
                .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
                .padRadius(radius * 1.5)
                .innerRadius(d => d.y0 * radius)
                .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

  const partition = data => {
      const root = d3.hierarchy(data)
                     .sum(d => d.size)
                     .sort((a, b) => b.value - a.value);
      return d3.partition()
               .size([2 * Math.PI, root.height + 1])(root);
  };

  function arcVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
  }

  function labelVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
  }

  function labelTransform(d) {
      const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
      const y = (d.y0 + d.y1) / 2 * radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  }

  /**
   * Four working methods to load data:
   * (1) Inline data in json format (JS plain objects);
   * (2) From an https URL, which works only afer allowing cross origin requests
   *     on Firefox if the data URL is not the same as your app server;
   * (3) From a local file;
   * (4) Calling require()('@observablehq/flare') (observable-specific). In fact,
   *     The same as (2).
   */

  //var data_url = "https://gist.githubusercontent.com/mbostock/1093025/raw/b40b9fc5b53b40836ead8aa4b4a17d948b491126/flare.json"; // network error!
  //var dataURL = "https://gist.githubusercontent.com/mbostock/4348373/raw/85f18ac90409caa5529b32156aa6e71cf985263f/flare.json";

  //const {require} = new observablehq.Library;
  //require()('@observablehq/flare').then((data, error) => { // works!
  //d3.json(dataURL).then((data, error) => { // works behind proxy!
      const root = partition(data);
      const color = d3.scaleOrdinal()
                      .range(d3.quantize(d3.interpolateRainbow,
                                         data.children.length + 1));
      console.log(root.descendants().slice(1));
      datas = root.descendants().slice(1);
/*
      function subColor(para){
        const z = d3.scaleOrdinal().range(d3.quantize(d3.interpolate("red", "blue"), para.parent.children.length + 1));
        return z(para.data.name);
      }
*/

      const subColor = function (para){
        let z = [];
        para.parent.children.forEach(d => z.push(d.data.name));
        return d3.scaleOrdinal()
                      .domain(z)
                      .range(d3.quantize(d3.interpolateRainbow,
                                         para.parent.children.length + 1))(para.data.name);}

      root.each(d => d.current = d);

      const svg = d3.select('#partitionSVG')
              .style("width", "100%")
              .style("height", "auto");
              //.style("font", "9px sans-serif");

      const g = svg.append("g")
                   .attr("transform", `translate(${width / 2},${width / 2})`);

      const path = g.append("g")
                    .selectAll("path")
                    .data(root.descendants().slice(1))
                    .join("path")
                    .attr("fill", d => {
                      if (d.depth == 1){
                        return color(d.data.name);
                      }
                      else{
                        while (d.depth > 3) { d = d.parent; }
                        console.log(subColor(d))
                        return subColor(d);
                      }
                    })
                    .attr("fill-opacity", d =>
                      arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
                    .attr("d", d => arc(d.current));

      path.filter(d => d.children)
          .style("cursor", "pointer")
          .on("click", clicked);

      path.append("title")
          .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

      const label = g.append("g")
                     .attr("pointer-events", "none")
                     .attr("text-anchor", "middle")
                     .style("user-select", "none")
                     .selectAll("text")
                     .data(root.descendants().slice(1))
                     .join("text")
                     .attr("dy", "0.35em")
                     .attr("fill-opacity", d => +labelVisible(d.current))
                     .attr("transform", d => labelTransform(d.current))
                     .text(d => d.data.name);

      const parent = g.append("circle")
                      .datum(root)
                      .attr("r", radius)
                      .attr("fill", "none")
                      .attr("pointer-events", "all")
                      .on("click", clicked);

      function clicked(p) {
        parent.datum(p.parent || root);

        root.each(d => d.target = {
          x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
          x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
          y0: Math.max(0, d.y0 - p.depth),
          y1: Math.max(0, d.y1 - p.depth)
        });

        const t = g.transition().duration(750);

        // Transition the data on all arcs, even the ones that aren’t visible,
        // so that if this transition is interrupted, entering arcs will start
        // the next transition from the desired position.
        path.transition(t)
            .tween("data", d => {
              const i = d3.interpolate(d.current, d.target);
              return t => d.current = i(t);
            })
            .filter(function (d) {
              return +this.getAttribute("fill-opacity") || arcVisible(d.target);
            })
            .attr("fill-opacity", d =>
              arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
            .attrTween("d", d => () => arc(d.current));

        label.filter(function (d) {
            return this.getAttribute("fill-opacity") || labelVisible(d.target);
          }).transition(t)
            .attr("fill-opacity", d => +labelVisible(d.target))
            .attrTween("transform", d => () => labelTransform(d.current));
      }
}
