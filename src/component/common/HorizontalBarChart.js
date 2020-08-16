import React, {useEffect, useState} from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import {HorizontalBar} from "react-chartjs-2";


function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function convertHex(hex, opacity) {
  hex = hex.substring(1);
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
}

export function HorizontalBarChart(props) {
  const {
    data = [{
      label: '',
      value: 0,
    }],
    datasetLabel = null,
    bodyWidth = 1
  } = props;

  const [chartData, setChartData] = useState({});

  const [hasData, setHasData] = useState(false);

  function initChartData() {
    let backgroundColors = [];
    let borderColors = [];
    for (let i = 0; i < data.length; i++) {
      let color = getRandomColor();
      backgroundColors.push(convertHex(color, 0.2));
      borderColors.push(convertHex(color, 1));
    }
    console.log(backgroundColors);
    setChartData(
      {
        labels: data.map(e => e['label']),
        datasets: [{
          data: data.map(e => e['value']),
          label: datasetLabel,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: bodyWidth
        }]
      }
    );
    if (data.length > 0) {
      setHasData(true);
    } else {
      setHasData(false);
    }
  }

  useEffect(() => {
    initChartData();
  }, [props]);

  const options = {
    scales: {
      xAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    maintainAspectRatio: false,
    responsive: true
  };

  function getPixel() {
    return ((chartData && chartData['labels']) ? (chartData['labels'].length * 27) : 300) + 'px';
  }

  return (
    <div style={{height: getPixel()}}>
      {!hasData ? <CircularProgress color={"secondary"}/> : ''}
      <HorizontalBar data={chartData} options={options}/>
    </div>
  );
}

