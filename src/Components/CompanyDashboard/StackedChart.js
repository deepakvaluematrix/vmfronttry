import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  Legend
);

const StackedChart = (props) => {
  let evaluated = props.evaluated;
  let jobskills = props.jobskills;
  // console.log("jobskills");
  // console.log(jobskills);
  let selfassested = props.selfassested;
  let jdSkills = props.jdSkills;
  const [headskills, setheadskills] = useState([]);
  const [globalroles, setglobalroles] = useState([]);
  const [globalsides, setglobalsides] = useState({});
  const [globalvals, setglobalvals] = useState({});
  const [globalval1s, setglobalval1s] = useState({});
  const [globalval2s, setglobalval2s] = useState({});
  const [globalsideskeys, setglobalsideskeys] = useState([]);
  const [globalvalskeys, setglobalvalskeys] = useState([]);

  useEffect(() => {
    let temp = [];
    let role = [];
    let side = {
      side1: [],
      side2: [],
      side3: [],
      side4: [],
      side5: [],
      side6: [],
      side7: [],
      side8: [],
    };
    let vals = {
      val1: [],
      val2: [],
      val3: [],
      val4: [],
      val5: [],
      val6: [],
      val7: [],
      val8: [],
    };
    let val1s = {
      val1: [],
      val2: [],
      val3: [],
      val4: [],
      val5: [],
      val6: [],
      val7: [],
      val8: [],
    };
    let val2s = {
      val1: [],
      val2: [],
      val3: [],
      val4: [],
      val5: [],
      val6: [],
      val7: [],
      val8: [],
    };
    for (let i = 0; i < evaluated?.length; i++) {
      if (!role.includes(evaluated[i]?.role)) {
        role.push(evaluated[i]?.role);
      }
      if (!side.side1.includes(evaluated[i]?.primarySkill)) {
        side.side1.push(evaluated[i]?.primarySkill);
      }
    }
    setglobalroles(jdSkills);
    let rolekeys = Object.keys(side);
    let valkeys = Object.keys(vals);
    setglobalsideskeys(rolekeys);
    setglobalvalskeys(valkeys);
    let tempvar = [];
    let tempval = [];
    let tempval2 = [];
    let tempval3 = [];
    for (let i = 0; i < role?.length; i++) {
      tempvar = [];
      tempval = [];
      tempval2 = [];
      tempval3 = [];
      for (let j = 0; j < evaluated?.length; j++) {
        //console.log("evaluated");
        //console.log(evaluated);
        if (
          !tempvar.includes(evaluated[j]?.primarySkill) &&
          role[i] === evaluated[j]?.role
        ) {
          tempvar.push(evaluated[j]?.primarySkill);
          tempval.push(evaluated[j]?.rating);
          if (jobskills[j]) {
            //console.log("jobskills[j]?.proficiency");
            //console.log(jobskills[j]?.proficiency);
            tempval2.push(jobskills[j]?.proficiency);
          } else {
            tempval2.push(0);
          }
          if (selfassested[j]) {
            //tempval3.push(selfassested[j]?.rating);
            tempval3.push(selfassested[j]?.proficiency);
          } else {
            tempval3.push(0);
          }
        }
      
      }
      side[rolekeys[i]] = tempvar;
      vals[valkeys[i]] = tempval;
      val1s[valkeys[i]] = tempval2;
      // console.log("val1s[valkeys[i]]");
      // console.log(val1s[valkeys[i]]);
      val2s[valkeys[i]] = tempval3;
    }
    // console.log("val1s");
    // console.log(val1s);

    setglobalsides(side);
    setglobalvals(vals);
    setglobalval1s(val1s);
    setglobalval2s(val2s);
  }, []);

  return (
    <div className="">
      {globalroles.map((roles, i) => {
        // console.log("globalvalskeys[i]") 
        // console.log(globalvalskeys[i]) 
        return (
          <div className="px-4 py-4">
            <Bar
              data={{
                labels: globalsides[globalsideskeys[i]],
                datasets: [
                  {
                    label: "Interviewer Rating",
                    data: globalvals[globalvalskeys[i]],
                    backgroundColor: "#046458",
                  },
                  {
                    label: "Required Rating",
                    data: globalval1s[globalvalskeys[i]],
                    backgroundColor: "#72D2C6",
                  },
                  {
                    label: "Self Rating",
                    data: globalval2s[globalvalskeys[i]],
                    backgroundColor: "#228276",
                  },
                ],
              }}
              height={400}
              width={950}
              options={{
                scales: {
                  "x": {
                    "ticks": {
                      "beginAtZero": true,
                      "minRotation": 0,
                      
                    },
                    "grid": {
                      "display": false,
                      "drawBorder": false,
                      
                    },                    
                  },
                  "y": {
                    "beginAtZero": true,
                    "axes": false
                  }
                },
                "responsive": true,
                "plugins": {
                  "legend": {
                    "display": true,
                    "position": "bottom",
                    "align": "center",
                    "font": 25
                  }
                }
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default StackedChart;
