import { ProfileSequences } from "../libs/cgraphicsgraph/cgraphicsgraphvertex"; 

ProfileSequences.forEach((ps, i) => { ps.m_bshow = localStorage.getItem("ProfileSequences[" + i + "].m_bshow") === 'true'; })

const GraphApplicationState = {
    m_cgraphicsgraph: null,
    m_labeltype: localStorage.getItem("label-type"),
    m_profiletype: localStorage.getItem("profile-type"),
    m_bshowgrid: false,
    m_ngridrows:  1,
    m_ngridcols: 1,
    m_bshowloadspinner: true,
    m_loadspinnermsg:"",
    m_numvertices: 0,
    m_vertices:"",
    m_numedges: 0,
    m_edges:"",
    m_profiles: {
        m_bshort: localStorage.getItem("m_bshort") === 'true',
        m_sequences:ProfileSequences
    },
    m_bleftsidebar: localStorage.getItem("m_bleftsidebar") === 'true',
    m_brightsidebar: localStorage.getItem("m_brightsidebar") === 'true'
}
export default GraphApplicationState;