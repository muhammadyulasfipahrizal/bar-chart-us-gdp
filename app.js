fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
      .then(response => response.json())
      .then(data => {
        const dataset = data.data;
        const years = dataset.map(d => new Date(d[0]));
        const gdpValues = dataset.map(d => d[1]);

        const margin = { top: 20, right: 20, bottom: 40, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3.select('#chart')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const xScale = d3.scaleTime()
          .domain([d3.min(years), d3.max(years)])
          .range([0, width]);

        const xAxis = d3.axisBottom(xScale);
        svg.append('g')
          .attr('id', 'x-axis')
          .attr('transform', `translate(0, ${height})`)
          .call(xAxis);

        const yScale = d3.scaleLinear()
          .domain([0, d3.max(gdpValues)])
          .range([height, 0]);

        const yAxis = d3.axisLeft(yScale);
        svg.append('g')
          .attr('id', 'y-axis')
          .call(yAxis);

        svg.selectAll('.bar')
          .data(dataset)
          .enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('data-date', d => d[0])
          .attr('data-gdp', d => d[1])
          .attr('x', (d, i) => xScale(years[i]))
          .attr('y', d => yScale(d[1]))
          .attr('width', width / dataset.length)
          .attr('height', d => height - yScale(d[1]))
          .on('mouseover', (event, d) => {
            const tooltip = document.getElementById('tooltip');
            tooltip.style.display = 'block';
            tooltip.style.left = event.pageX + 'px';
            tooltip.style.top = event.pageY + 'px';
            tooltip.setAttribute('data-date', d[0]);
            tooltip.innerHTML = `${d[0]}<br>$${d[1]} Billion`;
            d3.select(event.target).style('fill', 'white');
          })
          .on('mouseout', (event, d) => {
            const tooltip = document.getElementById('tooltip');
            tooltip.style.display = 'none';
            d3.select(event.target).style('fill', 'steelblue');
          });

        d3.select('body')
          .append('div')
          .attr('id', 'tooltip')
          .style('opacity', 0)
      });