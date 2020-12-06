import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { GraphApplicationActionsInstance as __ } from "../../reducers/graphapplicationactions";
import { fetchFromNetworkX } from '../../libs/utility/utility';

export function ErdorsRenyi() {
    const dispatch = useDispatch();
    const [_state, _setState] = useState({
        m_vertexcount: 0,
        m_probability: 0.5,
        m_bshowcharts: false,
        m_function: "erdos-renyi",
        m_requestid: -1
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
                p:_state.m_probability
            }
        } // end input

        //dispatch(__.showLoadSpinner(true));
        let call_obj = null;
        fetchFromNetworkX(input).subscribe({
            next(call_obj) {
                console.log("SUCCESS: Sent the request to NetworkX: " + JSON.stringify(call_obj)); 
            }, // end next()
            complete() {
                console.log("SUCCESS: NetworkX is done with the request: " + JSON.stringify(call_obj));  
                dispatch(__.showLoadSpinner(false));
            }, // end complete()
            error(error) {
                console.log("FAILURE: Could not send the request to NetworkX: " + JSON.stringify(error) + " Request: " + JSON.stringify(call_obj));
                dispatch(__.showLoadSpinner(false));
            } // end error()
        }); // end fetchFromNetwork()
    } // end handleClick()

    
        //n = _state.m_vertexcount;
        //p = 
        //dispatch(__.showLoadSpinner(true));
        // let currequest = null;
        /*
       fetchFromNetworkX(_state).subscribe({
            next(request) { 
                currequest = request;
               // console.log("SUCCESS: Sent the request to NetworkX: " + JSON.stringify(request));  
                _setState({m_requestid:request.m_requestid})
            },
            complete() { 
//console.log("SUCCESS: NetworkX is done with the request: " + JSON.stringify(currequest));  
                dispatch(__.showLoadSpinner(false));
            },
            error(error) { 
               // console.log("FAILURE: Could not send the request to NetworkX: " + JSON.stringify(error) + " Request: " + JSON.stringify(_state));
                dispatch(__.showLoadSpinner(false));
            }
        });
        */

    return (
    <div className="erdos-renyi">
        <div className="vertices input-group input-group-sm">
            <span className="input-group-addon" id="vertices">Vertices</span>
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
            <span className="input-group-addon" id="probability">Probability</span>
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

        <div className="charts">
            <label className="" id="charts">Show Charts:</label>&nbsp; 
            <input 
                onChange={handleChange} 
                type="checkbox" 
                name="bshowcharts" 
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