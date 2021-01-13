import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GraphApplicationActionsInstance as __ } from "../../reducers/graphapplicationactions";
import { fetchFromNetworkX } from '../../libs/utility/utility';
import "./barabasi_albert.css";

export function BarabasiAlbert() {
    const vprofiletype = useSelector(state=>state.m_vprofiletype2);
    const profilesequences = useSelector(state=>state.m_profilesequences);
    const dispatch = useDispatch();
    const [_state, _setState] = useState({
        m_n: 1,
        m_m: 1,
        m_bshowcharts: false,
        m_function: "barabasi-albert",
        m_t: 1,
        m_requestid: -1,
    });

    function handleChange(e) {
        const {name, value, type, checked} = e.target; 
        if(type === "checkbox") _setState({..._state,[name]:checked});
        else _setState({..._state,[name]:value});
    } // end handleChange()

    function handleClick(e) {  
        const input = {
            function_name:_state.m_function,
            function_params: {
                n:_state.m_n,
                m:_state.m_m,
                t:_state.m_t,
                bcharts: _state.m_bshowcharts,
                vprofiletype: vprofiletype,
            } // end function_params
        } // end input

        //alert(JSON.stringify(input));

        dispatch(__.setLoadSpinner(true, "Making NetworkX Call Please wait.........."));
        let this_call_obj = null;
        fetchFromNetworkX(input).subscribe({
            next(call_obj) {
                console.log("SUCCESS: Sent the request to NetworkX: " + JSON.stringify(call_obj)); 
                this_call_obj = call_obj;
                if(this_call_obj.status.message)
                    dispatch(__.setLoadSpinner(true, call_obj.status.message));
            }, // end next()
            complete() {
                console.log("SUCCESS: NetworkX is completed the request");  
                dispatch(__.setLoadSpinner(false,""));
                __.setNodesAndEdges(this_call_obj.output.nodes, this_call_obj.output.edges);
                dispatch(__.setCharts(_state.m_bshowcharts,this_call_obj.output.charts));
            }, // end complete()
            error(error) {
                console.log("FAILURE: Could not send the request to NetworkX: " + JSON.stringify(error) + " Request: " + JSON.stringify(this_call_obj));
                dispatch(__.setLoadSpinner(false,""));
            } // end error()
        }); // end fetchFromNetwork()
    } // end handleClick()

    return (
    <div className="barabasi-albert">
        <div className="n input-group input-group-sm">
            <span className="input-group-addon" id="vertices">n</span>
            <input 
                onChange={handleChange} 
                type="number" 
                className="form-control" 
                name="m_n"
                min="1" 
                value={_state.m_n} 
                max="10000" 
                placeholder="Enter Number of Vertices" 
                aria-describedby="n" 
            /> 
        </div>

        <div className="m input-group input-group-sm">
            <span className="input-group-addon" id="m">m</span>
            <input onChange={handleChange} 
                type="number" 
                className="form-control" 
                name="m_m" 
                min="1" 
                max="10000" 
                value={_state.m_m} 
                placeholder="Enter number of Edges" 
            />  
        </div>       

        {_state.m_bshowcharts &&
        <div className="trails input-group input-group-sm">
            <span className="input-group-addon" id="trails">t</span>
            <input 
                onChange={handleChange} 
                type="number" 
                className="form-control" 
                name="m_t"
                min="1" 
                value={_state.m_t} 
                max="10000" 
                placeholder="Enter Number of Trails" 
                aria-describedby="t" 
            /> 
        </div>
        }

        {(_state.m_bshowcharts) &&
        <div className="btn-group btn-group-profile-type">
            <button className="btn-profile-type btn btn-default btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <b>Profile</b> <span className="caret"></span>
            </button>
            <ul className="dropdown-menu">
                {profilesequences.map((sequence, i) => {
                    return (
                        <li className="profile" key={i}>                                
                            <>
                                <input 
                                    type="checkbox" 
                                    value={sequence.m_shortname} 
                                    checked={(vprofiletype && vprofiletype[sequence.m_shortname])?true:false}
                                    name={sequence.m_shortname} 
                                    onChange={(e)=>{dispatch(__.setProfileType2({id:e.currentTarget.value, checked:e.currentTarget.checked})); }}
                                />
                                <span>{sequence.m_shortname}</span>
                            </>
                        </li>
                    )
                })}
            </ul>
        </div>
        }

        <div className="show-charts">
            <label className="" id="show-charts">Show Charts:</label>&nbsp; 
            <input 
                onChange={handleChange} 
                type="checkbox" 
                name="m_bshowcharts" 
                checked={_state.m_bshowcharts}
                aria-describedby="trails" 
            />
        </div>

        <div className="generate input-group input-group-sm">
            <button 
                onClick={handleClick} 
                className="btn btn-default btn-sm" 
                type="button">Generate <span className="glyphicon glyphicon glyphicon glyphicon-ok" aria-hidden="true"></span>
            </button>
        </div>

        <div className="reset"></div>      
    </div>
   )
} 