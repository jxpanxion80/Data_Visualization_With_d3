let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
let req = new XMLHttpRequest()

let baseTemp
let values =[]

let xScale
let yScale

let minYear
let maxYear
let numberOfYears = maxYear - minYear

let width =1200
let height = 600
let padding = 60

let canvas = d3.select('#canvas')
canvas.attr('width', width)
canvas.attr('height', height)

let tooltip = d3.select('#tooltip')

let generateScales = () =>{

    minYear = d3.min(values, (item) =>{
        return item['year']
  })

  maxYear = d3.max(values, (item) =>{
      return item['year']
  })

    xScale = d3.scaleLinear()
                .domain([minYear, maxYear + 2])
               .range([padding, width-padding])

    yScale = d3.scaleTime()
                .domain([new Date(0, 0, 0, 0, 0, 0, 0), 
                        new Date(0, 12, 0, 0, 0, 0, 0)])
                .range([padding, height-padding])

}

let drawCells = () => {
//User Story 5 rect elements have class="cell"
  canvas.selectAll('rect')
          .data(values)
          .enter()
          .append('rect')
          .attr('class', 'cell')
//User Story 6 four different colors used for cells
          .attr('fill', (item) => {
            variance = item ['variance']
            if(variance <= -1){
              return 'Blue'
            }else if (variance <= 0){
              return 'DeepSkyBlue'
            }else if (variance <1 ){
              return 'Orange'
            }else{
              return 'Red'
            }
          })
          //User Story 7 each cell has data-month, data-year, data-temp properties
          //User story 8 data-month, data-year are in range of data
          .attr('data-year', (item) => {
            return item['year']
          })
          .attr('data-month', (item)=> {
            return item['month'] -1
          })
          .attr('data-temp', (item) =>{
            return baseTemp + item['variance']
          })
          //User Story 9 aligning cells with corresponding month on y-axis
          .attr('height', (height - (2 * padding))/12)
          .attr('y', (item) => {
            return yScale(new Date(0, item['month']- 1, 0, 0, 0, 0, 0))
          })
          .attr('width', (item) =>{
            let numberOfYears = maxYear-minYear
            return (width - (2*padding)) / numberOfYears
          })
          .attr('x', (item)=> {
            return xScale(item['year'])
          })
          //User Story 16 tooltip with a corresponding id="tooltip"
          .on('mouseover',(item) =>{
            tooltip.transition()
                  .style('visibility', 'visible')

                  let monthNames = [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                  ]

                  tooltip.text(item['year'] + ' ' + monthNames[item['month'] -1] + ' - ' + (baseTemp + item['variance']) + '(' + item['variance'] + ')')
                  //User Story 17 data-year coressponds with "data-year" of the active area
                  tooltip.attr('data-year', item['year'])
          } )
          .on('mouseout', (item) => {
            tooltip.transition()
                    .style('visibility', 'hidden')
          })

}

let drawAxes = () =>{

    let xAxis = d3.axisBottom(xScale)
                  .tickFormat(d3.format('d'))//User Story 12
//Story 3 element x-axis with id=x-axis
    canvas.append('g')
            .call(xAxis)
            .attr('id', 'x-axis')
            .attr('transform', 'translate(0, ' + (height-padding) +')')

    let yAxis = d3.axisLeft(yScale)
                  .tickFormat(d3.timeFormat('%B'))
 //Story 4 element y-axis with id=y-axis
    canvas.append('g')
            .call(yAxis)
            .attr('id', 'y-axis')
            .attr('transform', 'translate('+ padding + ', 0)')   


}

//Importing JSON data into a JS array
req.open('GET', url, true)
req.onload =() => {
  let object = JSON.parse(req.responseText)
  baseTemp = object['baseTemperature']
  values = object['monthlyVariance']
  console.log(baseTemp)//Confirm information is pulled with corresponding request
  console.log(values)//Confirm information is pulled with corresponding request
  generateScales()
  drawCells()
  drawAxes()
}
req.send()