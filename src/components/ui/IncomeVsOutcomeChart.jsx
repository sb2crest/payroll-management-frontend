import Chart from "react-apexcharts";

const IncomeVsOutcomeChart = () => {
  const chartOptions = {
    options: {
      chart: {
        height: 300,
        type: "area",
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      series: [
        {
          name: "Income",
          data: [
            18000, 51000, 60000, 38000, 88000, 50000, 40000, 52000, 88000,
            80000, 60000, 70000,
          ],
          color: "#AB85F0",
        },
        {
          name: "Outcome",
          data: [
            27000, 38000, 60000, 77000, 40000, 50000, 49000, 29000, 42000,
            27000, 42000, 50000,
          ],
          color: "#4D5664",
        },
      ],
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      grid: {
        strokeDashArray: 2,
      },
      fill: {
        type: "gradient",
        gradient: {
          type: "vertical",
          shadeIntensity: 1,
          opacityFrom: 0.1,
          opacityTo: 0.8,
        },
      },
      xaxis: {
        type: "category",
        tickPlacement: "on",
        categories: [
          "25 January 2023",
          "26 January 2023",
          "27 January 2023",
          "28 January 2023",
          "29 January 2023",
          "30 January 2023",
          "31 January 2023",
          "1 February 2023",
          "2 February 2023",
          "3 February 2023",
          "4 February 2023",
          "5 February 2023",
        ],
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        tooltip: {
          enabled: false,
        },
        labels: {
          style: {
            colors: "#9ca3af",
            fontSize: "13px",
            fontFamily: "Inter, ui-sans-serif",
            fontWeight: 400,
          },
          formatter: (title) => {
            let t = title;

            if (t) {
              const newT = t.split(" ");
              t = `${newT[0]} ${newT[1].slice(0, 3)}`;
            }

            return t;
          },
        },
      },
      yaxis: {
        labels: {
          align: "left",
          minWidth: 0,
          maxWidth: 140,
          style: {
            colors: "#9ca3af",
            fontSize: "13px",
            fontFamily: "Inter, ui-sans-serif",
            fontWeight: 400,
          },
          formatter: (value) => (value >= 1000 ? `${value / 1000}k` : value),
        },
      },
      tooltip: {
        x: {
          format: "MMMM yyyy",
        },
        y: {
          formatter: (value) =>
            `$${value >= 1000 ? `${value / 1000}k` : value}`,
        },
        custom: function ({ ctx, dataPointIndex }) {
          const { categories } = ctx.opts.xaxis;
          const title = categories[dataPointIndex].split(" ");
          const newTitle = `${title[0]} ${title[1]}`;

          return (
            '<div class="bg-white shadow-md p-2 rounded-md">' +
            "<div>" +
            newTitle +
            "</div>" +
            "<div>Income: $" +
            ctx.w.globals.series[0][dataPointIndex] +
            "</div>" +
            "<div>Outcome: $" +
            ctx.w.globals.series[1][dataPointIndex] +
            "</div>" +
            "</div>"
          );
        },
      },
      responsive: [
        {
          breakpoint: 568,
          options: {
            chart: {
              height: 300,
            },
            labels: {
              style: {
                colors: "#9ca3af",
                fontSize: "11px",
                fontFamily: "Inter, ui-sans-serif",
                fontWeight: 400,
              },
              offsetX: -2,
              formatter: (title) => title.slice(0, 3),
            },
            yaxis: {
              labels: {
                align: "left",
                minWidth: 0,
                maxWidth: 140,
                style: {
                  colors: "#9ca3af",
                  fontSize: "11px",
                  fontFamily: "Inter, ui-sans-serif",
                  fontWeight: 400,
                },
                formatter: (value) =>
                  value >= 1000 ? `${value / 1000}k` : value,
              },
            },
          },
        },
      ],
    },
  };

  return (
    <div className="bg-white rounded-lg shadow px-8 py-8 col-span-2">
      <div className="flex justify-center sm:justify-end items-center gap-x-4 mb-3 sm:mb-6">
        <div className="inline-flex items-center">
          <span className="inline-block h-2.5 w-2.5 bg-blue-600 rounded-sm mr-2"></span>
          <span className="text-xs text-gray-600">Income</span>
        </div>
        <div className="inline-flex items-center">
          <span className="inline-block h-2.5 w-2.5 bg-purple-600 rounded-sm mr-2"></span>
          <span className="text-xs text-gray-600">Outcome</span>
        </div>
      </div>
      <div id="chart">
        <Chart
          options={chartOptions.options}
          series={chartOptions.options.series}
          type="area"
          height={300}
          width="100%" // Set width to 100% of its container
        />
      </div>
    </div>
  );
};

export default IncomeVsOutcomeChart;
