import React from "react";
import Graph from "../graph/graph";
import Charts from "../charts/charts";
import "./content.css";

export default function Content(){
    return (
        <div className="content">
            <section className="graph-content">
				<Graph />
              {
                  
                <Charts />
              
             }  
            </section>
        </div>
    );
}