import React from "react";
import Graph from "../graph/graph";
import "./content.css";

export default function Content(){
    return (
        <div className="content">
            <section className="graph-content">
				<Graph />
            </section>
        </div>
    );
}