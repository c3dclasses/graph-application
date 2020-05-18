const GraphApplicationState = {
    m_cgraphicsgraph: null,
    m_labeltype: localStorage.getItem("label-type"),
    m_profiletype: localStorage.getItem("profile-type"),
    m_bshowgrid: false,
    m_numvertices: 0,
    m_vertices:"",
    m_numedges: 0,
    m_edges:"",
    m_profiles: {
        m_bshort: localStorage.getItem("bshort"),
        m_sequences:[
            {m_name: "degree", m_shortname:"deg", m_long:"", m_short:"", m_bshow:true},
            {m_name: "inclusive-minimum", m_shortname:"imin", m_long:null, m_short:null, m_bshow:true},
            {m_name: "exclusive-minimum", m_shortname:"emin", m_long:null, m_short:null, m_bshow:true},
            {m_name: "inclusive-maximum", m_shortname:"imax", m_long:null, m_short:null, m_bshow:true},
            {m_name: "exclusive-maximum", m_shortname:"emax", m_long:null, m_short:null, m_bshow:true}
        ]
    }
}
export default GraphApplicationState;