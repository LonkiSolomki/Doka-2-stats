d3.csv("data.csv").then(function(hdata) {
  hdata.forEach(function(d) {
    d.name = d.Heroes
    d.title = d.name
    d.value = +d["Times picked"]
    d.group = d.Stats
    d.winrate = +d.Wins / d.value
  });

  let maxWinrate = 0;
  let minWinrate = 1;

  function setWinrate (a) {
    if (a.winrate > maxWinrate) {
      maxWinrate = a.winrate
    }
    if (a.winrate < minWinrate) {
      minWinrate = a.winrate
    }
  }

  hdata.forEach(setWinrate);

  console.log([maxWinrate, minWinrate]);

  function compare (a, b) {
    return a.value < b.value ? 1 : -1;
  }

//hdata.sort(compare);

const pack = data => d3.pack()
    .size([width - 2, height - 2])
    .padding(1)
  (d3.hierarchy({children: data})
    .sum(d => d.value))

const width = 932
const height = width

const format = d3.format(",d")

var color = d3.scaleOrdinal()
  .domain(["int", "str", "dex"])
  .range(["#0021ff", "#d11800" , "#2c7c1c"]);

var wcolor = d3.scaleLinear()
	.domain([minWinrate, maxWinrate])
	.range(["green", "red"])


const root = pack(hdata);

let id = 0;

function generateId() { return id++; }

/*const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle");
*/

const svg = d3.select('svg');


function handleMouseOver(d, i) {
  console.log(d.data)
  let value = d.data.value
  let name = d.data.name
  d3.select(this)
    .attr("fill-opacity", 0.8)
    .attr("r", d => d.r + 5);

  /*svg.append("text")
    .attr("font-szie", 16)
    .attr("id", "t" + name + value)
    .attr("x", d3.mouse(this)[0]*2)
    .attr("y", d3.mouse(this)[1]*2)
    .text(function() {return name});
    */

  d3.selectAll("circle")
    .attr("fill", d => wcolor(d.data.winrate));
}

function handleMouseOut(d, i) {
  d3.select(this)
    .attr("fill-opacity", 0.65)
    .attr("r", d => d.r);

  d3.selectAll("circle")
    .attr("fill", d => color(d.data.group));

  //d3.select("#t" + d.data.name + d.data.value).remove();
}


const leaf = svg.selectAll("g")
    .data(root.leaves())
    .join("g")
      .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

leaf.append("circle")
      .attr("id", d => (d.leafUid = generateId()))
      .attr("r", d => d.r)
      .attr("fill-opacity", 0.65)
      .attr("fill", d => color(d.data.group));


leaf.append("clipPath")
    .attr("id", d => (d.clipUid = generateId()))
  .append("use")
    .attr("xlink:href", d => d.leafUid.href);

leaf.append("text")
  		.attr("font-size", d => Math.sqrt(d.data.value)/(2.5*Math.sqrt(d.data.name.length)))
      .attr("clip-path", d => d.clipUid)
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .join("tspan")
      .attr("x", 0)
      .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
      .text(d => d);


svg.selectAll("circle")
          .on("mouseover", handleMouseOver)
          .on("mouseout", handleMouseOut);
});