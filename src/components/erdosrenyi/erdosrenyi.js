import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GraphApplicationActionsInstance as __ } from "../../reducers/graphapplicationactions";
import { fetchFromNetworkX } from '../../libs/utility/utility';
import "./erdosrenyi.css";

export function ErdorsRenyi() {

    const vprofiletype = useSelector(state=>state.m_vprofiletype2);
    const profilesequences = useSelector(state=>state.m_profilesequences);
  
    const dispatch = useDispatch();
    const [_state, _setState] = useState({
        m_vertexcount: 1,
        m_probability: 0.5,
        m_probability2: 1.0,
        m_probabilitystep: 0.3,
        m_bshowcharts: false,
        m_bpoverx: false,
        m_function: "erdos-renyi",
        m_trails: 1,
        m_requestid: -1,
        m_maxsequencelength: false,
        m_maxvertexcount: false
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
                n:_state.m_vertexcount,
                p:_state.m_probability,
                p2:_state.m_probability2,
                pstep:_state.m_probabilitystep,
                t:_state.m_trails,
                bcharts: _state.m_bshowcharts,
                bpoverx: _state.m_bpoverx,
                vprofiletype: vprofiletype,
                maxsequencelength: _state.m_maxsequencelength,
                maxvertexcount: _state.m_maxvertexcount
            } // end function_params
        } // end input

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
    <div className="erdos-renyi">
        <div className="vertices input-group input-group-sm">
            <span className="input-group-addon" id="vertices">n</span>
            <input 
                onChange={handleChange} 
                type="number" 
                className="form-control" 
                name="m_vertexcount"
                min="1" 
                value={_state.m_vertexcount} 
                max="10000" 
                placeholder="Enter Number of Vertices" 
                aria-describedby="vertices" 
            /> 
        </div>

        <div className="probability input-group input-group-sm">
            <span className="input-group-addon" id="probability">p{(_state.m_bshowcharts &&  _state.m_bpoverx)?"1":""}</span>
            <input onChange={handleChange} 
                type="number" 
                className="form-control" 
                name="m_probability" 
                min="0" 
                max="1" 
                step="0.05"
                value={_state.m_probability} 
                placeholder="Probability" 
            />  
        </div>       

        {(_state.m_bshowcharts && _state.m_bpoverx) &&
        <div className="probability input-group input-group-sm">
            <span className="input-group-addon" id="probability">p2</span>
            <input onChange={handleChange} 
                type="number" 
                className="form-control" 
                name="m_probability2" 
                min="0" 
                max="1" 
                step="0.05"
                value={_state.m_probability2} 
                placeholder="Probability2" 
            />  
        </div> 
        }      

        {(_state.m_bshowcharts && _state.m_bpoverx) &&
        <div className="probability input-group input-group-sm">
            <span className="input-group-addon" id="probability">pstep</span>
            <input onChange={handleChange} 
                type="number" 
                className="form-control" 
                name="m_probabilitystep" 
                min="0" 
                max="1" 
                step="0.05"
                value={_state.m_probabilitystep} 
                placeholder="Probabilitystep" 
            />  
        </div>       
        }

        {_state.m_bshowcharts &&
        <div className="trails input-group input-group-sm">
            <span className="input-group-addon" id="trails">t</span>
            <input 
                onChange={handleChange} 
                type="number" 
                className="form-control" 
                name="m_trails"
                min="1" 
                value={_state.m_trails} 
                max="10000" 
                placeholder="Enter Number of Trails" 
                aria-describedby="trails" 
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
        {(_state.m_bshowcharts) &&<br />}
        {(_state.m_bshowcharts) &&
        <div className="btn-group btn-group-poverx-type">
            <button className="btn-profile-type btn btn-default btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <b>P Over X</b> <span className="caret"></span>
            </button>
            <ul className="dropdown-menu">
                <li className="profile" key="m_maxsequencelength">                                
                        <input 
                            type="checkbox" 
                            value="m_maxsequencelength" 
                            checked={_state.m_maxsequencelength}
                            name="m_maxsequencelength" 
                            onChange={handleChange}
                        />
                        <span>max sequence length</span>
                </li>
                <li className="profile" key="m_maxvertexcount">                                
                        <input 
                            type="checkbox" 
                            value="m_maxvertexcount" 
                            checked={_state.m_maxvertexcount}
                            name="m_maxvertexcount" 
                            onChange={handleChange}
                        />
                        <span>max vertex count</span>
                </li>
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

        <div className="p-over-x">
            <label className="" id="show-charts">P as X-axis:</label>&nbsp; 
            <input 
                onChange={handleChange} 
                type="checkbox" 
                name="m_bpoverx" 
                checked={_state.m_bpoverx}
                aria-describedby="p over x" 
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