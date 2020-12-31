//------------------------------------------------------------
// name: charts.js
// desc: defines the histogram component
//------------------------------------------------------------
import React, { Component, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { GraphApplicationActionsInstance as __ } from "../../reducers/graphapplicationactions";
import "./charts.css";

//------------------------------------------------------------
// name: Charts
// desc: defines the charts used to display the histograms
//------------------------------------------------------------
export default function Charts() {

    // stateand dispatchers
    const dispatch = useDispatch();
    const bshowcharts = useSelector(state=>state.m_bshowcharts);
    const bleftsidebar = useSelector(state=>state.m_bleftsidebar);
    const brightsidebar = useSelector(state=>state.m_brightsidebar);
    const charts = useSelector(state=>state.m_charts);
    const [_state, _setState] = useState({
        "deg":false, 
        "imax":false,
        "imin":false 
    }); // end useState

    // update the charts whenever the charts data change,  
    useEffect(handleUpdateChart, [charts, bleftsidebar, brightsidebar]);
    window.addEventListener("resize", handleChartResize);
    

    //------------------------------------------------------------
    // name: getLayout()
    // desc: returns the layout the chart
    //------------------------------------------------------------
    function getLayout(title, xtitle, ytitle) {
        if(!charts)
            return null;   
        return {
            title: `${title}`,
            showlegend: true,
            yaxis: {
                title: `${ytitle}`
            },
            xaxis: {
                title: `${xtitle}`
            }
        }; // end return
    } // end returns the layout of the chart


    //-------------------------------------------------------------
    // name: getPlacement()
    // desc: returns the placement of the chart
    //-------------------------------------------------------------
    function getPlacement() {
        return {
            margin:{t:0}, 
            editable: false,
            responsive: true
        }; // end return
    } // end getPlacement()

    
    //---------------------------------------------------
    // name: getPlots()
    // desc: returns the plots
    //---------------------------------------------------
    function getPlots() {
        let plots = [];
        for(let profile in charts.histograms)
            plots.push(getPlot(charts.histograms[profile]));
        return plots;
    } // end getPlots()


    //--------------------------------------------------
    // name: getPlot()
    // desc: returns the plot for a profile
    //--------------------------------------------------
    function getPlot(histogram) {
        let x = [];
        let y = [];
        let n = charts.n;
        let t = charts.t;

        for(let i=0; i<n; i++) {
            x.push(i)
            y.push(histogram._sum[i] ? (histogram._sum[i]/t) : 0)
        } // end for

        return {
            x, 
            y, 
            line: {shape: 'spline', width: 8},
            name: `${histogram._name}`,
        } // end return
    } // end getPlot()

    
    //--------------------------------------------------
    // name: getPlotsOverP
    // desc: return plots over p
    //--------------------------------------------------
    function getPlotsOverP() {
        let plots = [];

        if(charts.maxsequencelength) {
            for(let profile in charts._max_len) {
                plots.push(
                    getPlotOverP(
                        `max sequence length - ${profile}`, 
                        charts._p_over_x, 
                        charts._max_len[profile]
                    ) // end getPlotOverP()
                ); // end push()
            } // end for
        } // end if
        
        if(charts.maxvertexcount) {
            for(let profile in charts._max_vc) {
                plots.push(
                    getPlotOverP(
                        `max vertex count - ${profile}`, 
                        charts._p_over_x, 
                        charts._max_vc[profile]
                    ) // end getPlotOverP()
                ); // end push()
            } // end for
        } // end if

        return plots;
    } // end getPlotsOverP()

    //--------------------------------------------------
    // name: getPlot()
    // desc: returns the plot for a profile
    //--------------------------------------------------
    function getPlotOverP(profile_name, xdata, ydata) {
        let x = xdata;
        let y = ydata;
        //let n = charts.n;
        //let t = charts.t;

        console.log(profile_name)
        console.log(x);
        console.log(y);
            
      //  alert(profile_name)
       // for(let i=0; i<n; i++) {
         //   x.push(i)
         //   y.push(histogram._sum[i] ? (histogram._sum[i]/t) : 0)
        //} // end for

        return {
            x, 
            y, 
            line: {shape: 'spline', width: 8},
            name: `${profile_name}`,
        } // end return
    } // end getPlot()




    //----------------------------------------------------------------
    // name: handleUpdateChart()
    // desc: handles updating the charts when the charts data updates
    //----------------------------------------------------------------
    function handleUpdateChart() {
        if(!bshowcharts || !charts)
            return;

        // get chart parameters
        let n = charts.n;
        let t = charts.t; 
        let p = charts.p;
        let p1 = p;
        let p2 = charts.p2;
        let pstep = charts.pstep;
        let params = (!charts.bpoverx) ? `<b>n</b>=${n}, <b>p</b>=${p}, <b>t</b>=${t}` : 
                    `<b>n</b>=${n}, <b>p1</b>=${p1}, <b>p2</b>=${p2}, <b>pstep</b>=${pstep}, <b>t</b>=${t}`;
        let xlabel = (!charts.bpoverx) ? "degree" : "probability";
        let ylabel = (!charts.bpoverx) ? "count" : "max-count";

        // set up the layout
        let layout = getLayout(
            `<b>Erdos-Renyi</b><br />${params}`,
            `<b>${xlabel}</b>`,
            `<b>count</b>`
        ) // end getLayout()
        let placement = getPlacement();        
        let plots = (!charts.bpoverx) ? getPlots() : getPlotsOverP();
   
        // create the plot
        window.Plotly.newPlot(
            document.getElementById('charts-content'),
            plots,
            layout
        ); // end newPlot()
    } // end updateChart()

    //-----------------------------------------------------------
    // name: handleChartResize()
    // desc: handles the resizing of the chart
    //-----------------------------------------------------------
    function handleChartResize(e) {
        let container = document.getElementsByClassName("charts-container")[0];
        setTimeout(()=>
            window.Plotly.relayout(
                document.getElementById('charts-content'),
                {
                    width: container.offsetWidth,
                    height: container.offsetHeight
                } // end
            ), // end relayout()
        100); // end setTimeout()
    } // end handleChartResize()


    //-----------------------------------------------------------
    // name: handleClick()
    // desc: closes the charts on x button click
    //-----------------------------------------------------------
    function handleClick(e) {  
        // _setState({..._state, m_showchart:!_state.m_showchart})
        dispatch(__.setCharts(false,null))
    } // end handleClick()


    //-----------------------------------------------------------
    // name: handleChange()
    // desc: selects the profiles to show
    //-----------------------------------------------------------
    function handleChange(e) {
        const {name, value, type, checked} = e.target; 
        if(type === "checkbox") _setState({..._state,[name]:checked});
        else _setState({..._state,[name]:value});
    } // end handleChange()


    //-----------------------------------------------------------
    // name: render 
    // desc: renders the html to show charts and controls
    //-----------------------------------------------------------
    return (
        <div className={`charts ${bshowcharts ? 'charts-show': ''}`}>
            <div className="charts-container">
                <button id="charts-close" onClick={handleClick} class="btn btn-default btn-sm">
                    <span class="glyphicon glyphicon-remove"></span>
                </button>
                <section id="charts-content"></section>
                <section id="charts-content-2"></section>
            </div>
        </div>
    ); // end return
} // end Charts