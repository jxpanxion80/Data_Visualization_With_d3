//Building JavaScript for Bar Chart
let xmlhttp = new XMLHttpRequest();
let svg;

const svgSize = {
  width: 900,
  height: 500,
};

const padding ={
  x: 60,
  y: 30,
};

const createTitle = () => { /*Connected to Line 42*/ 
  return d3.select("main")
           .append("title")
           .attr("id", "title")
           .text("U.S. GDP");
};

const createCanvas = () =>{ /*Conntected to Line 43*/ 
  const svg = d3.select("main")
                .append("svg")
                .attr("width", svgSize.width)
                .attr("height", svgSize.height);
  return svg;
};

const createTooltip = () =>{ /*Connected to Line 44*/ 
  return d3.select("body")
           .append("div")
           .attr("id", "tooltip");
};

const sendRequestToAPI = (xmlhttp) => { /*Connected to Line 45 */ 
  const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
  const method = 'GET';
  xmlhttp.open(method, url, true)
  return xmlhttp;
};

const defineScales = (dates, gdps) => {
  //Formating the dates information display
  const minDate = d3.min(dates, (d) => new Date (d));
  const maxDate = d3.max(dates, (d) => new Date (d));
  //Formating the gdps information display
  const maxgdp = d3.max(gdps, (d) => d);
  
  //Scaling the xAxis data
  const xScale = d3.scaleTime()
                   .domain([minDate, maxDate])
                   .range([padding.x, svgSize.width -  padding.x / 3]);
  
  //Scaling yAxis data
  const yScale = d3.scaleLinear()
                   .domain([0, maxgdp])
                   .range([svgSize.height - padding.y, padding.y]);
  
  return{xScale, yScale};
  
};

const createAxes = (scales, svg) => {
  svg.append('g')
     .attr("id", "x-axis")
     .call(d3.axisBottom(scales.xScale))
     .attr("transform", `translate(0, ${svgSize.height - padding.y})`);
  
  svg.append('g')
     .attr("id", "y-axis")
     .call(d3.axisLeft(scales.yScale))
     .attr("transform", 'translate(50, 0)')
     .attr("class", "tick");
};

const createBars = (dates, gdps, scales) =>{
  svg.selectAll("rect")
     .data(gdps)
     .enter()
     .append("rect")
     .attr("x", (d, i) => scales.xScale(new Date (dates[i])))
     .attr("y", (d) => scales.yScale (d))
     .attr("width", (svgSize.width - padding.x * 1.33) / gdps.length)
     .attr("height", (d) => svgSize.height - scales.yScale(d) - padding.y)
     .attr("class", "bar")
     .attr("data-date", (d,i) => dates[i])
     .attr("data-gdp", (d) => d)
     .on("mouseover", (e,d) => {
     let bil = d.toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    d3.select("#tooltip")
      .style("opacity", 0.85)
      .style("left", e.pageX + 6 + 'px')
      .style("top", e.pageY + 6 + 'px')
      .html(`<p>Date: ${dates[gdps.indexOf(d)]}</p><p>$${bil} Billion</p>`)
      .attr('data-date', dates[gdps.indexOf(d)])
  })
  .on("mouseout", () => {
    return d3.select("#tooltip")
             .style("opacity", 0)
             .style("left", 0)
             .style("top", 0)
  });
};

const createSourceLinkAndDate = (dataset) => {
  d3.select("main")
    .append("div")
    .attr("id", "desc");
  
  d3.select("#desc")
    .append("p")
    .text("Data updated on: " + dataset.updated_at.match(/^.{10}/));
  
  d3.select("#desc")
    .append("p")
    .text("The latest info can be found at: " + dataset.description.match(/http.+pdf/));
  
};

xmlhttp.onload = () => {
  const dates = [];
  const gdps = [];
  const dataset = JSON.parse(xmlhttp.responseText);
  dataset.data.forEach(element => {
    gdps.push(element[1]);
    dates.push(element[0]);
  });
  
  const scales = defineScales(dates, gdps);
  createAxes(scales, svg);
  createBars(dates, gdps, scales);
  createSourceLinkAndDate(dataset);
};

const driver = () =>{
 createTitle();/*Source on Line 15*/
 svg = createCanvas();/*Source on Line 22*/ 
 createTooltip();/*Source Line 30*/ 
 xmlhttp = sendRequestToAPI(xmlhttp);/*Source on Line 36*/ 
 xmlhttp.send()
};
driver();